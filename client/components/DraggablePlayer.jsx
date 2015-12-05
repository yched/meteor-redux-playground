import React from 'react';
import { findDOMNode } from 'react-dom';
import { compose, pure, setPropTypes } from 'recompose';
import { map } from 'react-immutable-proptypes';
import { DragSource, DropTarget } from 'react-dnd';
import PlayerItem from './Player';

let DraggablePlayerItem = (props) => {
  return props.connectDropTarget(props.connectDragSource(
    <div style={{ opacity: props.isDragging ? 0.5 : 1 }}>
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
      _id: props.player.get('_id'),
      index: props.index
    };
  },
  endDrag(props, monitor) {
    console.log(monitor.getDropResult());
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

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    console.log(props.player.get('name') + ' ' + hoverIndex);
    props.dragPlayer(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
  drop(props) {
    return {
      target: props.player.get('_id'),
      index: props.index
    };
  }
};
function targetCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}
export default DropTarget('PLAYER', cardTarget, targetCollect)(DragSource('PLAYER', cardSource, sourceCollect)(DraggablePlayerItem));
