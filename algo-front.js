class Config {
    constructor() {
        Object.assign(this, {
            gasFuel: 30,
            storageFuel: 30,
            amountGas: 10,
            amountTankers: 2,
            costTanker: 30000,
            timeTankerDelivery: 3,
            baseRefillCost: 3000,
            refillCost: 2000,
            rateRefillCost: 2,
            amountCarMonth: 2,
            amountCarFuel: 5,
            salaryGas: 2700,
            salaryWorkPlace: 500,
            timeBuildGas: 2,
            timeBuildWorkPlace: 1,
            salaryCashier: 500,
            salaryRefueller: 500,
            salaryDirector: 500,
            salarySecurity: 500,
            limitWorkPlace: 4,
            probDismiss: 0.5,
            timeMonth: 2,
        })

        this.year = 12
    }
}

class State {
    constructor() {
        this.storageFuel = config.storageFuel
        this.amountGas = 0
        this.amountTankers = 0
        this.profit = 0
        this.curMonth = 0
    }
}

class Worker {
    constructor() {
        this.contract = "safe"
        this.isDismissed = false
        this.beforeDismiss = 2
    }

    paySalary() {
        if (this.isDismissed) return
        state.profit -= this.salary()
    }
}

class Director extends Worker {
    salary() {
        return config.salaryDirector
    }
}

class Cashier extends Worker {
    salary() {
        return config.salaryCashier
    }
}

class Security extends Worker {
    salary() {
        return config.salarySecurity
    }
}

class WorkPlace {
    constructor() {
        this.isBuild = false
        this.beforeBuild = config.timeBuildWorkPlace
    }

    paySalary() {
        state.profit -= config.salaryWorkPlace + config.salaryRefueller
    }
}

class Tanker {
    constructor() {
        state.amountTankers += 1
        this.from = "storage"
        this.to = null
        this.restTime = this.timeTankerDelivery
        this.isArrived = true
        this.what = null
    }

    isFree() {
        return this.isArrived
    }

    use(to, what) {
        this.isArrived = false
        this.restTime = this.timeTankerDelivery
        this.what = what
        this.to = to
    }

    tick() {
        this.restTime -= 1

        if (this.restTime <= 0) {
            this.isArrived = true
            this.from = this.to
        }
    }

    static createExists() {
        const tanker = new this()

        return tanker
    }

    static createNew() {
        const tanker = new this()

        state.profit -= config.costTanker

        return tanker
    }
}

class TankerManager {
    constructor() {
        this.commonTankers = []
        this.mainTanker = null
        this.init()
    }

    create() {
        this.tankers.push(Tanker.createNew())
    }

    init() {
        for (let i = 0; i < state.amountTankers; i++) {
            const tanker = Tanker.createExists()

            if (i == 0) {
                this.mainTanker = tanker
            } else {
                this.commonTankers.push(tanker)
            }
        }

        if (this.mainTanker === null) {
            const tanker = Tanker.createNew()

            this.mainTanker = tanker
        }
    }

    tick() {
        for (const tanker of this.tankers) {
            tanker.tick()
        }
    }

    getFreeTanker() {
        const freeTankers = this.commonTankers.filter((tanker) =>
            tanker.isFree(),
        )

        if (freeTankers.length) {
            return freeTankers[9]
        }
    }
}

class Gas {
    constructor() {
        state.amountGas += 1
        this.fuel = config.gasFuel
        this.costFuel = config.baseRefillCost
        this.amountClient = Math.floor(this.fuel / config.amountCarFuel)
        this.staff = [new Cashier(), new Security(), new Director()]
        this.isDestroyed = false
        this.workPlaces = []
        this.beforeDestruction = config.timeBuildGas

        this.commonTasks = [
            this.earnWorkPlaces.bind(this),
            this.staffPaySalary.bind(this),
            this.payGas.bind(this),
            this.payWorkPlaces.bind(this),
        ]
    }

    tick() {
        for (const task of this.commonTasks) {
            task()
        }
    }

    payGas() {
        if (this.isDestroyed === false) {
            state.profit -= config.salaryGas
        }
    }

    staffPaySalary() {
        for (const staff of this.staff) {
            staff.paySalary()
        }
    }

    payWorkPlaces() {
        for (const workPlace of this.workPlaces) {
            workPlace.paySalary()
        }
    }

    earnWorkPlaces() {
        for (const workPlace of this.workPlaces) {
            if (workPlace.isBuild) {
                this.earnWorkPlace()
            }
        }
    }

    earnWorkPlace() {
        let amountRefill = config.amountCarMonth

        while (true) {
            if (amountRefill <= 0) return

            this.fuel -= config.amountCarFuel

            if (this.fuel < 0) {
                this.fuel += config.amountCarFuel
                return
            }

            amountRefill -= 1
            state.profit += this.costFuel
        }
    }

    dismissWorkers() {
        for (const worker of this.staff) {
            worker.beforeDismiss -= 1
        }

        for (const worker of this.staff) {
            if (worker.beforeDismiss === 0) {
                worker.isDismissed = true
            }
        }
    }

    destroyGas() {
        this.beforeDestruction -= 1

        if (this.beforeDestruction === 0) {
            this.isDestroyed = true
        }
    }

    buildWorkPlace(idx) {
        if (this.workPlaces[idx]) {
            this.workPlaces[idx].beforeBuild -= 1

            if (this.workPlaces[idx].beforeBuild === 0) {
                this.workPlaces[idx].isBuild = true
                this.costFuel *= config.rateRefillCost
            }
        } else {
            this.workPlaces[idx] = new WorkPlace()
        }
    }

    destroyWorkPlace(idx) {
        const workPlace = this.workPlaces[idx]
        workPlace.beforeDestruction -= 1

        if (workPlace.beforeDestruction === 0) {
            workPlace.isDestroyed = true
        }
    }

    static baseMaintain() {
        return (
            config.salaryGas +
            config.salaryCashier +
            config.salaryDirector +
            config.salarySecurity
        )
    }

    static baseSalary() {
        return (
            config.salaryCashier + config.salaryDirector + config.salarySecurity
        )
    }
}

class GasFabric {
    constructor() {
        this.waiters = 1
    }

    amountClients() {
        return Math.floor(config.gasFuel / config.amountCarFuel)
    }

    profitFromClients() {
        return this.amountClients() * config.baseRefillCost
    }

    sellProfit() {
        let profit = 0
        let workTime = 0
        let allTime = 0

        workTime += Math.ceil(this.amountClients() / config.amountCarMonth) // fuel selling
        allTime += workTime
        allTime += config.timeBuildWorkPlace

        profit -= Gas.baseSalary()
        profit -= config.timeBuildWorkPlace * config.salaryGas
        profit -= config.timeBuildWorkPlace * config.salaryWorkPlace
        profit -= config.salaryWorkPlace * workTime
        profit -= config.salaryRefueller * workTime

        profit -= Gas.baseMaintain() * workTime

        profit += this.profitFromClients()

        profit += Gas.baseSalary() * (config.year - allTime - 1)

        if (config.year - allTime - config.timeBuildGas > 0) {
            const timeWithoutGas = config.year - allTime - config.timeBuildGas

            profit += timeWithoutGas * config.salaryGas
        }

        return profit
    }

    destroyProfit() {
        let profit = 0

        profit -= config.salaryGas * config.timeBuildGas
        profit += config.salaryGas * (config.year - config.timeBuildGas)
        profit += Gas.baseSalary() * (config.year - 1)
        profit -= this.profitFromClients()

        return profit
    }

    takeFuelWaitTanker(waiters) {
        let profit = 0

        profit -= config.salaryGas * config.timeTankerDelivery * 2 * waiters
        profit -= config.salaryGas * config.timeTankerDelivery
        profit -= config.salaryGas * config.timeBuildGas
        profit += config.salaryGas * (config.year - config.timeBuildGas)
        profit += Gas.baseSalary() * (config.year - 1)
        profit += this.profitFromClients()

        return profit
    }

    takeFuelBuyTanker() {
        let profit = 0

        profit -= config.costTanker
        profit -= config.salaryGas * config.timeTankerDelivery
        profit -= config.salaryGas * config.timeBuildGas
        profit += config.salaryGas * (config.year - config.timeBuildGas)
        profit += Gas.baseSalary() * (config.year - 1)
        profit += this.profitFromClients()

        return profit
    }

    createGases() {
        const gases = []

        if (config.amountGas === 0) {
            gases.push(new GasMainNew())
        } else {
            gases.push(new GasMain())
        }

        for (let i = 0; i < config.amountGas - 1; i++) {
            let destroyProfit = this.destroyProfit()
            let sellProfit = this.sellProfit()
            let takeFuelWaitTanker = this.takeFuelWaitTanker(this.waiters)
            // let takeFuelBuyTanker = this.takeFuelBuyTanker()
            let maxProfit

            maxProfit = Math.max(destroyProfit, sellProfit, takeFuelWaitTanker)

            if (maxProfit === destroyProfit) {
                gases.push(new GasDestroy())
            } else if (maxProfit === sellProfit) {
                gases.push(new GasSell())
            } else if (maxProfit === takeFuelWaitTanker) {
                this.waiters += 1
                gases.push(new GasTakeFuelWaitTanker())
            }

            console.log(
                destroyProfit,
                sellProfit,
                takeFuelWaitTanker,
                "max",
                maxProfit,
            )
        }

        return gases
    }
}

class GasMainNew extends Gas {
    tick() {}
}

class GasMain extends Gas {
    constructor() {
        super()

        this.tasks = [this.getFuel.bind(this), this.buildWorkPlace.bind(this)]

        this.restTimeStation = config.timeBuildWorkPlace
    }

    tick() {
        for (const task of this.tasks) {
            task()
        }

        super.tick()
    }

    buildWorkPlace() {
        let lastIdx = this.workPlaces.length
        const maxFuel = fuelStorage.maxFuel()
        const maxStations = Math.ceil(
            maxFuel / (config.amountCarMonth * config.amountCarMonth),
        )

        this.restTimeStation -= 1

        for (let i = 0; i < maxStations; i++) {
            super.buildWorkPlace(lastIdx)
            lastIdx += 1
        }
    }

    getFuel() {
        const freeTanker = tankerManager.getFreeTanker()
        const mainTanker = tankerManager.mainTanker

        if (freeTanker && freeTanker.from === "main") {
            this.fuel += freeTanker.what
        }

        if (mainTanker.from === "main") {
            this.fuel += mainTanker.fuel
            mainTanker.to("storage")
        }
    }
}

class GasDestroy extends Gas {
    constructor() {
        super()
        this.tasks = [
            this.dismissWorkers.bind(this),
            this.destroyGas.bind(this),
        ]
    }

    tick() {
        for (const task of this.tasks) {
            task()
        }

        super.tick()
    }
}

class GasSell extends Gas {
    constructor() {
        super()
        this.tasks = [
            this.dismissWorkers.bind(this),
            this.buildWorkPlace.bind(this, 0),
            this.whenEmpty.bind(this),
        ]

        this.wasEmpty = false
    }

    tick() {
        for (const task of this.tasks) {
            task()
        }

        super.tick()
    }

    whenEmpty() {
        if (this.fuel <= 0) {
            this.wasEmpty = true
            this.destroyGas()
            this.dismissWorkers()
            this.destroyWorkPlace(0)
        }
    }

    dismissWorkers() {
        if (config.timeBuildWorkPlace >= 2) {
            super.dismissWorkers()
        }
    }
}

class GasTakeFuelWaitTanker extends Gas {
    constructor() {
        super()

        this.tasks = [
            this.waitTanker.bind(this),
            this.dismissWorkers.bind(this),
            this.destroyGas.bind(this),
        ]
        this.tankerProcessed = false
    }

    tick() {
        for (const task of this.tasks) {
            task()
        }

        super.tick()
    }

    waitTanker() {
        if (this.tankerProcessed) return

        const freeTanker = tankerManager.getFreeTanker()

        if (freeTanker && freeTanker.from === this) {
            freeTanker.use("main", this.fuel)
            this.tankerProcessed = true
        } else if (freeTanker) {
            freeTanker.use(this)
        }
    }

    destroyGas() {
        if (this.tankerProcessed) super.destroyGas()
    }
}

class GasManager {
    constructor(gases) {
        this.gases = gases

        console.log(gases)
    }

    tick() {
        for (const gas of this.gases) {
            gas.tick()
        }
    }
}

class FuelStorage {
    init(months) {
        this.months = []

        for (const month of months) {
            this.months.push(month)
        }
    }

    maxFuel() {
        return Math.max(...this.months)
    }

    tick() {
        const mainTanker = tankerManager.mainTanker

        if (mainTanker.from === "storage") {
            const fuel = this.months.shift()

            mainTanker.use("main", fuel)
        }
    }
}

class World {
    constructor() {}

    tick() {
        state.curMonth += 1
        fuelStorage.tick()
        gasManager.tick()
    }
}

const fuelStorage = new FuelStorage([10, 15, 0, 5])
const config = new Config()
const state = new State()
const tankerManager = new TankerManager()

const gasFabric = new GasFabric()
const gases = gasFabric.createGases()

const gasManager = new GasManager(gases)

const world = new World()

export { fuelStorage, config, state, tankerManager, gases, gasManager, world }
