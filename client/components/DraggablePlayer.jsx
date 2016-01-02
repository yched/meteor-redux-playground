import React from 'react';
import { findDOMNode } from 'react-dom';
import { compose, pure, setPropTypes } from 'recompose';
import ImmutableModels from 'client/immutable_models';
import { DragSource, DropTarget } from 'react-dnd';
import PlayerItem from './Player';

let DraggablePlayerItem = (props) => {
  // Cheat : do not pass the index down to the Item, do avoid unneeded repaints.
  // In typical cases, though, the item will have to display its index...
  const {index, ...itemProps} = props;
  return props.connectDropTarget(props.connectDragSource(
    <div style={{ opacity: props.isDragging ? 0.5 : 1 }} className={'draggable-player' + (props.isDragging ? ' dragging' : '')}>
      <PlayerItem {...itemProps} />
    </div>
  ));
};

DraggablePlayerItem = compose(
  pure,
  setPropTypes({
    player: ImmutableModels.player.propType.isRequired,
    index: React.PropTypes.number.isRequired,
    isSelected: React.PropTypes.bool,
    selectPlayer: React.PropTypes.func.isRequired,
    dragCallback: React.PropTypes.func.isRequired,
    dropCallback: React.PropTypes.func.isRequired,
    endDragCallback: React.PropTypes.func.isRequired
  })
)(DraggablePlayerItem);

// Wrap with React-dnd higher-order components.
// Inspired from https://github.com/gaearon/react-dnd/tree/master/examples/04%20Sortable
const cardSource = {
  beginDrag(props) {
    return {
      playerId: props.player._id,
      index: props.index,
    };
  },
  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      props.dropCallback();
    }
    else {
      props.endDragCallback();
    }
  }
};
const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < 0) {
      return;
    }
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverBoundingRect.bottom) {
      return;
    }

    // Time to actually perform the action
    props.dragCallback(monitor.getItem().playerId, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

DraggablePlayerItem = compose(
  DropTarget('PLAYER', cardTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget()
  })),
  DragSource('PLAYER', cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))
)(DraggablePlayerItem);

export default DraggablePlayerItem;
