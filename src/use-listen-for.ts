import {DependencyList, useEffect} from "react";

export interface UseListenForOptions {
	bundle?: string;
}

/**
 * Subscribe to Messages sent from NodeCG Bundles.
 *
 * @param messageName The name of the message to listen for
 * @param handler A callback function to handle the message. Similar to * `React.useCallback()`'s handler
 * @param options Options object that accepts a `bundle` option to specify the bundle that the expected message is from.
 * @param dependencies An array of values that the handler depends on. Similar to `React.useCallback()`'s dependencies
 *
 * @example
 * ```ts
 * const [message, setMessage] = useState<string>("");
 *
 * useListenFor("hello", (msg: string) => {
 *   if(msg === "Hello")
 *     setMessage(msg);
 * }, { bundle: "hello-bundle" }, [message]);
 * ```
 */
export const useListenFor = <T>(
	messageName: string,
	handler: (message: T) => void,
	options?: UseListenForOptions,
	dependencies?: DependencyList,
): void => {
	useEffect(() => {
		if (options && options.bundle) {
			nodecg.listenFor(messageName, options.bundle, handler);
			return () => {
				if (!options.bundle) return;
				nodecg.unlisten(messageName, options.bundle, handler);
			};
		}
		nodecg.listenFor(messageName, handler);
		return () => {
			nodecg.unlisten(messageName, handler);
		};
	}, [handler, messageName, options, ...(dependencies || [])]);
};
