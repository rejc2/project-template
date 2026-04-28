import type { InfiniteData } from '@tanstack/react-query';

export type WithOptional<TObject, TKey extends keyof TObject> = Omit<TObject, TKey> &
	Partial<Pick<TObject, TKey>>;

export class LookupCache<TData, TItem, TId extends string | number> {
	#getPageItems: (page: TData) => TItem | TItem[];
	#getId: (item: TItem) => TId;
	#cache = new WeakMap<InfiniteData<TData>, Map<TId, TItem>>();

	constructor(getPageItems: (data: TData) => TItem | TItem[], getId: (item: TItem) => TId) {
		this.#getPageItems = getPageItems;
		this.#getId = getId;
	}

	get(infiniteData: undefined | InfiniteData<TData>, id: TId): undefined | TItem {
		if (infiniteData == null) {
			return undefined;
		}

		let map = this.#cache.get(infiniteData);
		if (map == null) {
			map = new Map<TId, TItem>();
			for (const item of infiniteData.pages.flatMap((page) => this.#getPageItems(page))) {
				map.set(this.#getId(item), item);
			}
		}

		return map.get(id);
	}
}
