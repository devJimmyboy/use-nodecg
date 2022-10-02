import {useState} from "react";

export interface UseReplicantOnceOptions {
	bundle: string;
}

export const useReplicantOnce = <T, U = T>(
	replicantName: string,
	initialValue: U,
	options?: UseReplicantOnceOptions,
): T => {
	const [state, setState] = useState<T>(initialValue! as T);
	if (options && options.bundle) {
		nodecg.readReplicant<T>(replicantName, options.bundle, (value) => {
			setState(value);
		});
	} else {
		nodecg.readReplicant<T>(replicantName, (value) => {
			setState(value);
		});
	}
	return state;
};
