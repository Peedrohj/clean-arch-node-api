import { CacheStore } from "@/data/protocols/cache"
import { LocalSavePurchases } from "@/data/usecases"
import { SavePurchases } from "@/domain/usecases"

class CacheStoreSpy implements CacheStore {
    deleteCallsCount: number = 0
    insertCallsCount: number = 0
    deleteKey: string = ""
    insertKey: string = ""
    insertValues: Array<SavePurchases.Params> = []

    delete(deleteKey: string): void {
        this.deleteCallsCount++
        this.deleteKey = deleteKey
    }

    insert(insertKey: string, value: any): void {
        this.insertCallsCount++
        this.insertKey = insertKey
        this.insertValues = value
    }

    simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(() => { throw new Error() })
    }
}

type SutTypes = {
    sut: LocalSavePurchases
    cacheStore: CacheStoreSpy
}

const mockPurchases = (): Array<SavePurchases.Params> => [
    {
        id: "1",
        date: new Date(),
        value: 50
    },
    {
        id: "2",
        date: new Date(),
        value: 50
    }
]

const makeSut = (): SutTypes => {
    const cacheStore: CacheStoreSpy = new CacheStoreSpy()
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
        await sut.save(mockPurchases())

        expect(cacheStore.deleteCallsCount).toBe(1)
    })

    test('Should call delete with correct deleteKey', async () => {
        const { sut, cacheStore } = makeSut()
        await sut.save(mockPurchases())

        expect(cacheStore.deleteKey).toBe("purchases")
    })

    test('Should not insert new data in cache if delete fails', async () => {
        const { sut, cacheStore } = makeSut()
        cacheStore.simulateDeleteError()
        const promise = sut.save(mockPurchases())

        expect(cacheStore.insertCallsCount).toBe(0)
        expect(promise).rejects.toThrow()
    })

    test('Should insert new data in cache if delete succeeds', async () => {
        const { sut, cacheStore } = makeSut()
        const purchases = mockPurchases()
        await sut.save(purchases)

        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.insertCallsCount).toBe(1)
        expect(cacheStore.insertKey).toBe("purchases")
        expect(cacheStore.insertValues).toEqual(purchases)
    })
}) 