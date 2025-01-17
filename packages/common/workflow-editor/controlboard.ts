import { type Node } from 'reactflow';
import { getNodeRenderInfo } from './node-rendering';
/**
 * Controlboard Config Data
 */
export type ControlBoardConfig = {
  nodes: ControlBoardNodeConfig[];
}

/**
 * Controlboard Node Config
 */
export type ControlBoardNodeConfig = {
  id: string;
  fields: string[];
  apiInputFields?: string[];
  apiInputFieldsNameMapping?: Record<string, string>;
  apiOutputFields?: string[];
  apiOutputFieldsNameMapping?: Record<string, string>;
}

export type ControlBoardNodeProps = {
  nodeControl?: ControlBoardNodeConfig;
  node: Node,
}

export const ControlBoardUtils = {
  createControlboardInfoFromNodes(nodes: Node[]): ControlBoardConfig {
    const nodeList = nodes.map(node => {
      const {params, id} = getNodeRenderInfo(node as any);
      const fields = params.map(param => param.property);
      return {
        id,
        fields
      } as ControlBoardNodeConfig
    });
    return {
      nodes: nodeList
    }
  },
  getNodesToRender(controlboardConfig: ControlBoardConfig | undefined, nodes: Node[]): ControlBoardNodeProps[] {
    const nodesToRender: ControlBoardNodeProps[] = [];

    /**
     * if do not have config: 
     *  - render all nodes
     * else:
     *  - render all nessessary nodes
     */
    if (!controlboardConfig) {
      ControlBoardUtils.autoSortNodes(nodes).forEach(node => {
        nodesToRender.push({
          node
        });
      })
    } else {
      (controlboardConfig?.nodes || []).forEach(nodeControl => {
        const node = nodes.find(n => n.id === nodeControl.id);
        if (node) {
          nodesToRender.push({
            nodeControl,
            node
          })
        }
      });
    }
    return nodesToRender;
  },
  autoSortNodes(nodes: Node[]): Node[] {
    return nodes.sort((a, b) => {
      const widgeta = (a.data.widget.name + a.data.widget.display_name).toLowerCase();
      const widgetb = (b.data.widget.name + b.data.widget.display_name).toLowerCase();
      return getPriority(widgetb) - getPriority(widgeta);
    });

    function getPriority(name: string): number {
      if (name.includes('cliptextencod')) {
        return 10
      }
      if (name.includes('loadimage')) {
        return 9;
      }
      if (name.includes('checkpoint')) {
        return 8;
      }
      if (name.includes('lora')) {
        return 7;
      }
      if (name.includes('sampler')) {
        return 4;
      }
      return 0;
    }
  }
}

