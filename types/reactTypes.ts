export type StateError = string | null;

export type ContextActionMap<M extends { [key: string]: any }> = {
	[Key in keyof M]: M[Key] extends undefined
		? {
				type: Key;
		  }
		: {
				type: Key;
				payload: M[Key];
		  };
};

export type PrettyPathPrefixes = { [pathPrefix: string]: string };
