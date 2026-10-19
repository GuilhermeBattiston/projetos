// Draft prototypes require an explicit local build opt-in.
export function selectBuilds(registry, includeDrafts = false) {
  return registry.filter(entry => entry.draft !== true || includeDrafts === true);
}
