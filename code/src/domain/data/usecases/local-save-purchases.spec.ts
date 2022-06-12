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

type SutTypes = {
    sut: LocalSavePurchases
    cacheStore: CacheStore
}

const makeSut = (): SutTypes => {
    const cacheStore: CacheStore = new CacheStoreSpy()
    const sut: LocalSavePurchases = new LocalSavePurchases(cacheStore)

    return {
        sut,
        cacheStore
    }
}

describe('LocalSavePurchases', () => {
    test('Should not delete cache on init', () => {
        const { cacheStore } = makeSut()
        new LocalSavePurchases(cacheStore)
        expect(cacheStore.deleteCallsCount).toBe(0)
    })

    test('Should delete cache on save', async () => {
        const { sut, cacheStore } = makeSut()
        await sut.save()

        expect(cacheStore.deleteCallsCount).toBe(1)
    })
}) 