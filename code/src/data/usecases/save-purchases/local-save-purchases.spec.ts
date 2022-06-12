import { CacheStore } from "@/data/protocols/cache"
import { LocalSavePurchases } from "@/data/usecases"

class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0
    key: string = ""

    delete(key: string): void {
        this.deleteCallsCount++
        this.key = key
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

    test('Should call delete with correct key', async () => {
        const { sut, cacheStore } = makeSut()
        await sut.save()

        expect(cacheStore.key).toBe("purchases")
    })
}) 