export default function reducer(state = {}, action) {
  if (action.type === "SOMETHING_HERE") {
    state = {
      ...state
    };
  }

  return state;
}
