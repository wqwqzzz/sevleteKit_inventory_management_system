// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
        interface Platform {
            env: Env
            cf: CfProperties
            ctx: ExecutionContext
        }
    }
}

interface Platform {
    env: {
       DATABASE: DB;
    };
    context: {
       waitUntil(promise: Promise<any>): void;
    };
    caches: CacheStorage & { default: Cache };
 }
export {};