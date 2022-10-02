import {useEffect, useState, SetStateAction, Dispatch, useRef} from "react";
import clone from "lodash.clone";
import {ReplicantOptions} from "nodecg/types/browser";

/**
 * Subscribe to a replicant, returns tuple of the replicant value and `setValue` function.
 * The component using this function gets re-rendered when the value is updated.
 * The `setValue` function can be used to update replicant value.
 * @param replicantName The name of the replicant to use
 * @param initialValue Initial value to pass to `useState` function
 * @param options Options object.  Currently supports the optional `namespace` option
 */
export const useReplicant = <T, U = T>(
	replicantName: string,
	initialValue: U,
	options?: ReplicantOptions<T> & {namespace?: string},
): [T | U, Dispatch<SetStateAction<T>>] => {
	const [value, updateValue] = useState<T>(initialValue! as T);

	const replicantOptions = options && {
		defaultValue: options.defaultValue,
		persistent: options.persistent,
		schemaPath: options.schemaPath,
	};
	const replicant = useRef(
		options && options.namespace
			? nodecg.Replicant(replicantName, options.namespace, replicantOptions)
			: nodecg.Replicant(replicantName, replicantOptions),
	);

	const changeHandler = (newValue: T): void => {
		updateValue((oldValue) => {
			if (newValue !== oldValue) {
				return newValue;
			}
			// replicant.value has always the same reference. Cloning to cause re-rendering
			return clone(newValue);
		});
	};

	useEffect(() => {
		replicant.current.on("change", changeHandler);
		return () => {
			replicant.current.removeListener("change", changeHandler);
		};
	}, []);

	return [value, updateValue];
};
