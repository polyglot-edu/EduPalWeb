export function clearFlowCaches(flowId: string) {
  try {
    localStorage.removeItem('flow');
    localStorage.removeItem('rescue-' + flowId);
  } catch (error) {
    console.warn('Failed to clear flow caches', error);
  }
}
