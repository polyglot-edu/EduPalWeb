import { merge } from '@fluentui/react';
import produce, { enableMapSet } from 'immer';
import { Connection, Edge, Node } from 'reactflow';
import type { PartialDeep } from 'type-fest';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  PolyglotEdge,
  PolyglotFlow,
  PolyglotFlowInfo,
  PolyglotNode,
} from './types/polyglotElements';
import { createNewDefaultPolyglotEdge } from './utils/utils';

enableMapSet();

type Action = {
  type: 'remove' | 'update' | 'create';
  element: {
    type: 'node' | 'edge' | 'flow';
    id: string;
  };
  value: any;
};

function createElementMapping<T extends PolyglotNode | PolyglotEdge>(arr: T[]) {
  const mapping = new Map<string, T>();
  arr.forEach((el) => {
    mapping.set(el.reactFlow.id, el);
  });
  return mapping;
}

export type SelectedElement = {
  type: 'Node' | 'Edge' | 'none';
  id: string;
};

interface ApplicationState {
  published: any;
  currentAction: number;
  lastSavedAction: number;
  actions: Action[];
  setLastSavedAction: () => void;
  addAction: (action: Action) => void;
  backAction: () => void;
  forwardAction: () => void;
  popAction: () => Action | undefined;
  checkBackAction: () => boolean;
  checkForwardAction: () => boolean;
  checkSave: () => boolean;

  loadFlow: (flow: PolyglotFlow) => void;
  updateFlowInfo: (
    newValue: PartialDeep<PolyglotFlowInfo>,
    skipAction?: boolean
  ) => void;
  getFlow: () => Nullable<PolyglotFlow>;
  activeFlowInfo: Nullable<PolyglotFlowInfo>;
  nodeMap: Map<string, PolyglotNode>;
  edgeMap: Map<string, PolyglotEdge>;
  reactFlowNodes: () => Node[];
  reactFlowEdges: () => Edge[];

  selectedElement: Nullable<SelectedElement>;
  selectedNode: Nullable<string>;
  selectedEdge: Nullable<string>;
  getSelectedElement: () => PolyglotEdge | PolyglotNode | undefined;
  getSelectedNode: () => Nullable<PolyglotNode>;
  getSelectedEdge: () => Nullable<PolyglotEdge>;
  setSelectedElement: (element: SelectedElement) => void;
  setSelectedNode: (nodeId: string) => void;
  setSelectedEdge: (edgeId: string) => void;
  clearSelection: () => void;

  updateElement: (element: PolyglotNode | PolyglotEdge) => void;

  applyNodeChanges: (changes: Node[]) => void;
  applyEdgeChanges: (changes: Edge[]) => void;

  addSubFlow: (flow: PolyglotFlow) => void;
  addNode: (initialValue: PolyglotNode, skipAction?: boolean) => void;
  updateNode: (
    id: string,
    newValue: PartialDeep<PolyglotNode>,
    skipAction?: boolean
  ) => void;
  removeNode: (id: string, skipAction?: boolean) => void;

  addEdge: (initialValue: PolyglotEdge, skipAction?: boolean) => void;
  updateEdge: (
    id: string,
    newValue: PartialDeep<PolyglotEdge>,
    skipAction?: boolean
  ) => void;
  removeEdge: (id: string, skipAction?: boolean) => void;

  onConnect: (connection: Connection, skipAction?: boolean) => void;
}

const useStore = create<ApplicationState>()(
  devtools(
    persist(
      (set, get) => ({
        currentAction: -1,
        lastSavedAction: -1,
        actions: [] as Action[],
        setLastSavedAction: () => {
          set((state) => ({
            lastSavedAction: state.currentAction,
          }));
        },
        addAction: (action) => {
          set((state) => {
            const tmp = [...state.actions];
            // Remove all next actions ad add the new action
            if (state.currentAction < state.actions.length - 1)
              tmp.splice(state.currentAction + 1);
            tmp.push(action);
            return {
              currentAction: tmp.length - 1,
              actions: tmp,
            };
          });
        },
        backAction: () => {
          set((state) => {
            if (state.currentAction < 0) {
              console.log('Forbidden backAction operation!');
              return {
                currentAction: state.currentAction,
              };
            }
            const action = state.actions[state.currentAction];
            switch (action.type) {
              case 'create':
                switch (action.element.type) {
                  case 'node':
                    state.removeNode(action.element.id, true);
                    break;
                  case 'edge':
                    state.removeEdge(action.element.id, true);
                    break;
                }
                break;
              case 'remove':
                switch (action.element.type) {
                  case 'node':
                    state.addNode(action.value, true);
                    break;
                  case 'edge':
                    state.addEdge(action.value, true);
                    break;
                }
                break;
              case 'update':
                switch (action.element.type) {
                  case 'node':
                    state.updateNode(
                      action.element.id,
                      action.value.prev,
                      true
                    );
                    break;
                  case 'edge':
                    state.updateEdge(
                      action.element.id,
                      action.value.prev,
                      true
                    );
                    break;
                  case 'flow':
                    state.updateFlowInfo(action.value.prev, true);
                    break;
                }
                break;
            }
            return {
              currentAction: state.currentAction - 1,
            };
          });
        },
        forwardAction: () => {
          set((state) => {
            const forwardIndex = state.currentAction + 1;
            if (forwardIndex >= state.actions.length) {
              console.log('Forbidden forwardAction operation!');
              return {
                currentAction: state.currentAction,
              };
            }
            const action = state.actions[forwardIndex];
            switch (action.type) {
              case 'create':
                switch (action.element.type) {
                  case 'node':
                    state.addNode(action.value, true);
                    break;
                  case 'edge':
                    state.addEdge(action.value, true);
                    break;
                }
                break;
              case 'remove':
                switch (action.element.type) {
                  case 'node':
                    state.removeNode(action.value._id, true);
                    break;
                  case 'edge':
                    state.removeEdge(action.value._id, true);
                    break;
                }
                break;
              case 'update':
                switch (action.element.type) {
                  case 'node':
                    state.updateNode(
                      action.element.id,
                      action.value.update,
                      true
                    );
                    break;
                  case 'edge':
                    state.updateEdge(
                      action.element.id,
                      action.value.update,
                      true
                    );
                    break;
                  case 'flow':
                    state.updateFlowInfo(action.value.update, true);
                    break;
                }
                break;
            }
            return {
              currentAction: forwardIndex,
            };
          });
        },
        popAction: () => {
          let action;
          set((state) => {
            const tmp = [...state.actions]; // deep copy
            action = tmp.splice(state.currentAction, 1)[0];
            return {
              actions: tmp,
              currentAction: state.currentAction - 1,
            };
          });
          return action as Action | undefined;
        },
        checkBackAction: () => {
          const state = get();
          return state.currentAction > -1;
        },
        checkForwardAction: () => {
          const state = get();
          return state.currentAction < state.actions.length - 1;
        },
        checkSave: () => {
          const state = get();
          return state.currentAction !== state.lastSavedAction;
        },

        loadFlow: (flow) => {
          set((state) =>
            produce(state, (draft) => {
              draft.actions = [];
              draft.currentAction = -1;
              draft.lastSavedAction = -1;
              draft.activeFlowInfo = flow as PolyglotFlowInfo;
              if (flow.nodes) draft.nodeMap = createElementMapping(flow.nodes);
              if (flow.edges) draft.edgeMap = createElementMapping(flow.edges);
              draft.clearSelection();
            })
          );
        },
        updateElement(element) {
          const state = get();
          if (element.type.includes('Node')) {
            const node = state.nodeMap.get(element.reactFlow.id);
            if (!node) {
              console.log('Node not found');
              return;
            }

            if (node.type !== element.type)
              return; //changeNodeType(node, element.type);//remove to fast fix the code
            else
              state.updateNode(element.reactFlow.id, element as PolyglotNode);
          }

          if (element.type.includes('Edge')) {
            const edge = state.edgeMap.get(element.reactFlow.id);
            if (!edge) {
              console.log('Edge not found!');
              return;
            }
            if (edge.type !== element.type)
              return; //changeEdgeType(edge, element.type);//remove to fast fix the code
            else
              state.updateEdge(element.reactFlow.id, element as PolyglotEdge);
          }
        },
        published: () => {
          const publish = get().getFlow()?.publish;
          return publish;
        },
        updateFlowInfo: (newValue, skipAction) => {
          if (!skipAction) {
            const state = get();
            state.addAction({
              type: 'update',
              element: {
                type: 'flow',
                id: '',
              },
              value: {
                prev: state.activeFlowInfo,
                update: newValue,
              },
            });
          }
          set((state) =>
            produce(state, (draft) => {
              if (!draft.activeFlowInfo) return;
              draft.activeFlowInfo = merge<PolyglotFlowInfo>(
                draft.activeFlowInfo,
                newValue
              );
            })
          );
        },
        getFlow: () => {
          const state = get();
          if (!state.activeFlowInfo) {
            return state.activeFlowInfo;
          }

          return {
            ...state.activeFlowInfo,
            nodes: Array.from(state.nodeMap.values()),
            edges: Array.from(state.edgeMap.values()),
          };
        },
        activeFlowInfo: null as Nullable<PolyglotFlowInfo>,

        nodeMap: new Map<string, PolyglotNode>(),
        edgeMap: new Map<string, PolyglotEdge>(),
        reactFlowNodes: () =>
          Array.from(get().nodeMap.values()).map((node) =>
            Object.assign({}, node.reactFlow)
          ),
        reactFlowEdges: () =>
          Array.from(get().edgeMap.values()).map((edge) =>
            Object.assign({}, edge.reactFlow)
          ),

        selectedElement: null as Nullable<SelectedElement>,
        selectedNode: null as Nullable<string>,
        selectedEdge: null as Nullable<string>,
        getSelectedElement: () => {
          const state = get();
          const selectedElement = state.selectedElement;
          if (!selectedElement) return undefined;

          switch (selectedElement.type) {
            case 'Node':
              return state.nodeMap.get(selectedElement.id);
            case 'Edge':
              return state.edgeMap.get(selectedElement.id);
            default:
              console.log('Invalid selected type!');
              return undefined;
          }
        },
        getSelectedNode: () => {
          const state = get();
          if (state.selectedNode !== null) {
            return state.nodeMap.get(state.selectedNode) || null;
          }
          return null as Nullable<PolyglotNode>;
        },
        getSelectedEdge: () => {
          const state = get();
          if (state.selectedEdge !== null) {
            return state.edgeMap.get(state.selectedEdge) || null;
          }
          return null;
        },
        setSelectedElement: (element) => {
          set(() => ({
            selectedElement: element,
          }));
        },
        setSelectedNode: (nodeId) => {
          set(() => ({
            selectedNode: nodeId,
            selectedEdge: null,
          }));
        },
        setSelectedEdge: (edgeId) => {
          set(() => ({
            selectedNode: null as Nullable<string>,
            selectedEdge: edgeId,
          }));
        },
        clearSelection: () => {
          set(() => ({
            selectedElement: null as Nullable<SelectedElement>,
            selectedNode: null as Nullable<string>,
            selectedEdge: null as Nullable<string>,
          }));
        },

        applyNodeChanges: (changes) => {
          set((state) =>
            produce(state, (draft) => {
              changes.forEach((change) => {
                const node = draft.nodeMap.get(change.id);
                if (!node) return;
                node.reactFlow = merge(node.reactFlow, change);
              });
            })
          );
        },
        applyEdgeChanges: (changes) => {
          set((state) =>
            produce(state, (draft) => {
              changes.forEach((change) => {
                const edge = draft.edgeMap.get(change.id);
                if (!edge) return;
                edge.reactFlow = merge(edge.reactFlow, change);
              });
            })
          );
        },
        addSubFlow: (flow) => {
          set((state) =>
            produce(state, (draft) => {
              if (flow.nodes) {
                const subflowNodeMap = createElementMapping(flow.nodes);
                subflowNodeMap.forEach((v, k) => draft.nodeMap.set(k, v));
              }
              if (flow.edges) {
                const subflowEdgeMap = createElementMapping(flow.edges);
                subflowEdgeMap.forEach((v, k) => draft.edgeMap.set(k, v));
              }
              draft.clearSelection();
            })
          );
        },
        addNode: (initialValue, skipAction) => {
          set((state) =>
            produce(state, (draft) => {
              draft.nodeMap.set(initialValue.reactFlow.id, initialValue);
            })
          );
          if (!skipAction) {
            const state = get();
            state.addAction({
              type: 'create',
              element: { type: 'node', id: initialValue._id },
              value: initialValue,
            });
          }
        },
        updateNode: (id, newValue, skipAction) => {
          if (!skipAction) {
            const state = get();
            const node = state.nodeMap.get(id);
            if (!node) {
              console.log('Node not present!');
              return;
            }
            state.addAction({
              type: 'update',
              element: {
                type: 'node',
                id: id,
              },
              value: {
                prev: node,
                update: newValue,
              },
            });
          }

          set((state) =>
            produce(state, (draft) => {
              const node = draft.nodeMap.get(id);
              if (!node) {
                console.log('Node not present!');
                return;
              }
              const mergeVal = merge<PolyglotNode>(
                node,
                newValue as PolyglotNode
              );
              if (!mergeVal) {
                console.log('error merging');
                return;
              }
              // TODO: find a better way to handle edge creation
              // apply runtime data transformation on edge in case of new edge creation
              //removed to fast fix the code
              /*
              const transformed =
                polyglotNodeComponentMapping.applyTransformFunction(mergeVal);
              // apply transform function to every node's edge
              const nodeEdges = Array.from(state.edgeMap.values()).filter(
                (value) => value.reactFlow.source === transformed.reactFlow.id
              );
              nodeEdges.forEach((edge) => {
                const transEdge =
                  polyglotEdgeComponentMapping.applyTransformFunction(edge);
                draft.edgeMap.set(transEdge._id, transEdge);
              });
*/
              //draft.nodeMap.set(id, transformed);
            })
          );
        },
        removeNode: (id, skipAction) => {
          if (!skipAction) {
            const state = get();
            state.addAction({
              type: 'remove',
              element: { type: 'node', id: id },
              value: state.nodeMap.get(id),
            });
          }
          set((state) =>
            produce(state, (draft) => {
              draft.nodeMap.delete(id);
              Object.entries(draft.edgeMap).forEach(([edgeId, edge]) => {
                if (
                  edge.reactFlow.source === id ||
                  edge.reactFlow.target === id
                ) {
                  draft.edgeMap.delete(edgeId);
                }
              });
            })
          );
        },

        addEdge: (initialValue, skipAction) => {
          set((state) =>
            produce(state, (draft) => {
              draft.edgeMap.set(initialValue.reactFlow.id, initialValue);
            })
          );
          if (!skipAction) {
            const state = get();
            state.addAction({
              type: 'create',
              element: { type: 'edge', id: initialValue._id },
              value: initialValue,
            });
          }
        },
        updateEdge: (id, newValue, skipAction) => {
          if (!skipAction) {
            const state = get();
            const edge = state.edgeMap.get(id);
            if (!edge) {
              console.log('Edge not present!');
              return;
            }
            state.addAction({
              type: 'update',
              element: {
                type: 'edge',
                id: id,
              },
              value: {
                prev: edge,
                update: newValue,
              },
            });
          }
          set((state) =>
            produce(state, (draft) => {
              // TODO: FIXME: make sure that newValue as PolyglotEdge is correct!!!
              const edge = draft.edgeMap.get(id);
              if (!edge) {
                console.log('Node not present!');
                return;
              }
              const mergeVal = merge<PolyglotEdge>(
                edge,
                newValue as PolyglotEdge
              );
              if (!mergeVal) {
                console.log('error merging');
                return;
              }
              // TODO: find a better way to handle edge creation
              // apply runtime data transformation on edge in case of new edge creation

              //removed to fast fix the code
              /*const transformed =
                polyglotEdgeComponentMapping.applyTransformFunction(mergeVal);
              draft.edgeMap.set(id, transformed);*/
            })
          );
        },
        removeEdge: (id, skipAction) => {
          if (!skipAction) {
            const state = get();
            state.addAction({
              type: 'remove',
              element: { type: 'edge', id: id },
              value: state.edgeMap.get(id),
            });
          }
          set((state) =>
            produce(state, (draft) => {
              draft.edgeMap.delete(id);
            })
          );
        },

        onConnect: (connection, skipAction) => {
          let newEdge: any;
          set((state) =>
            produce(state, (draft) => {
              if (!connection.source || !connection.target) {
                console.log('Source or target undefined!');
                return;
              }
              const sourceNode = draft.nodeMap.get(connection.source)!;

              newEdge = createNewDefaultPolyglotEdge(
                connection.source,
                sourceNode.type, //to be changed into group type (learning/assessment)
                connection.target
              );
              draft.edgeMap.set(newEdge.reactFlow.id, newEdge);
            })
          );
          if (!skipAction) {
            const state = get();
            state.addAction({
              type: 'create',
              element: { type: 'edge', id: newEdge._id },
              value: newEdge,
            });
          }
        },
      }),
      {
        name: 'flow',
        serialize: (data) => {
          return JSON.stringify({
            ...data,
            state: {
              ...data.state,
              nodeMap: Array.from(data.state.nodeMap.values()),
              edgeMap: Array.from(data.state.edgeMap.values()),
            },
          });
        },
        deserialize: (str) => {
          const flow = JSON.parse(str);

          flow.state.nodeMap = createElementMapping(flow.state.nodeMap);
          flow.state.edgeMap = createElementMapping(flow.state.edgeMap);

          return flow;
        },
      }
    ),
    { serialize: { options: { map: true } } }
  )
);

export const curriedUpdate = <T>(
  updateFunc: (id: string, newValue: PartialDeep<T>) => void,
  id: string
) => {
  return (newValue: PartialDeep<T>) => {
    updateFunc(id, newValue);
  };
};

export default useStore;
