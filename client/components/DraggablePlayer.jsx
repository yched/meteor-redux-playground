import React from 'react';
import { findDOMNode } from 'react-dom';
import { compose, pure, setPropTypes } from 'recompose';
import { map } from 'react-immutable-proptypes';
import { DragSource, DropTarget } from 'react-dnd';
import PlayerItem from './Player';

let DraggablePlayerItem = (props) => {
  return props.connectDropTarget(props.connectDragSource(
    <div style={{ opacity: props.isDragging ? 0.5 : 1 }} className={'draggable-player' + (props.isDragging ? ' dragging' : '')}>
      <PlayerItem {...props} />
    </div>
  ));
};

DraggablePlayerItem = compose(
  pure,
  setPropTypes({
    player: map.isRequired,
    selected: React.PropTypes.bool,
    selectPlayer: React.PropTypes.func.isRequired
  })
)(DraggablePlayerItem);

// https://github.com/gaearon/react-dnd/tree/master/examples/04%20Sortable
const cardSource = {
  beginDrag(props) {
    return {
      playerId: props.player.get('_id'),
      index: props.player.get('index'),
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
function sourceCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

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
function targetCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

export default
  DropTarget('PLAYER', cardTarget, targetCollect)(
    DragSource('PLAYER', cardSource, sourceCollect)(
      DraggablePlayerItem
    )
  );
