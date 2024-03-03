export function assert(condition: unknown, error = "condition not met"): asserts condition{
	if(!condition) {
		throw new TypeError(error);
	}
}