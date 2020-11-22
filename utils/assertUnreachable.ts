export default function assertUnreachable(x: never): never {
	throw new Error(`! Unreachable reached -> ' ${x}`);
}
