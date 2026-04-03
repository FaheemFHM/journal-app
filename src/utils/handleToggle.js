
export function toggleIcon(
  xId,
  field,
  urlFolder,
  state,
  setState
) {
  const newDate = new Date().toISOString();

  // find item and new value
  const item = state.find(x => x.id === xId);
  if (!item) return;
  const newValue = !item[field];

  // get new state
  const prevState = state;
  const newState = state.map(x =>
    x.id === xId
      ? {
          ...x,
          [field]: newValue,
          datetimemodified: newDate
        }
      : x
  );

  // optimistic update
  setState(newState);

  // backend update
  fetch(`http://localhost:5000/${urlFolder}/${xId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      [field]: newValue,
      datetimemodified: newDate
    })
  }).catch(() => {
    setState(prevState);
  });
}
