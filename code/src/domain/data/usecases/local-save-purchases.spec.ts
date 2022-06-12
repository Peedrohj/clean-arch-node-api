class LocalSavePurchases {
    constructor(private readonly cacheStore: CacheStore) { }

    async save(): Promise<void> {
        this.cacheStore.delete()
    }
}

interface CacheStore {
    deleteCallsCount: number

    delete(): void
}


class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0

    delete(): void {
        this.deleteCallsCount++
    }
}

describe('LocalSavePurchases', () => {
    test('Should not delete cache on init', () => {
        const cacheStore: CacheStore = new CacheStoreSpy()
        new LocalSavePurchases(cacheStore)
        expect(cacheStore.deleteCallsCount).toBe(0)
    })

    test('Should delete cache on save', async () => {
        const cacheStore: CacheStore = new CacheStoreSpy()
        const sut = new LocalSavePurchases(cacheStore)
        await sut.save()

        expect(cacheStore.deleteCallsCount).toBe(1)
    })
}) 