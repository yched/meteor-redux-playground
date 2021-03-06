import createHelper from 'recompose/createHelper';
import visualizeRender from 'react-render-visualizer-decorator';

export default {

  // Wrapper pour appliquer visualizeRender via 'compose'.
  visualizeRender: createHelper(function (component) {
    visualizeRender(component);
    return component;
  })

}
