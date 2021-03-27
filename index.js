import "bootstrap/dist/css/bootstrap.css"
import "./style.css"
import $ from "jquery"
import { config, fuelStorage, gases } from "./algo-front"

const gasEls = []

$(".fuel-input").each((i, el) => {
	$(el).val(0)
})

$(".start-emulation").on("click", function () {
	$(this).addClass("disabled")

	initMap()
	mainloop()
})

class GasEl {
	constructor(name) {
		this.name = name
		this.left = 200
		this.right = document.documentElement.clientWidth - 50
		this.top = 300
		this.bottom = document.documentElement.clientHeight - 100
        this.iconClass = ""

		this.randomPoint()
	}

	randomPoint() {
        let x, y

		while (true) {
            let isLong = true
			x = Math.random() * (this.right - this.left) + this.left
			y = Math.random() * (this.bottom - this.top) + this.top

			for (const otherGas of gasEls) {
				const ox = otherGas.x
				const oy = otherGas.y

                const distance = Math.sqrt(Math.pow(x - ox, 2) + Math.pow(y - oy, 2))

                if (distance < 25) isLong = false 
			}

            if (isLong) break
		}

		this.x = x
		this.y = y
	}

    setGreyIcon() {
        this.iconClass = "grey"
    }

	genEl() {
		this.el = $(`
            <div class="gas-marker-container">
                <i class="fas fa-map-marker ${this.iconClass}"></i>
                <div class="name">${this.name}</div>
            </div>
        `)
	}

	insert() {
        this.genEl()
		this.style()

		$(".map-container").append(this.el)
	}

	style() {
		this.el.css("left", this.x)
		this.el.css("top", this.y)
	}
}

function initMap() {
	const fuelFields = $(".fuel-input").map((i, el) => $(el).val())

	for (let i = 0; i < gases.length; i++) {
		let name = "АЗС"
		if (i === 0) name += " главная"
		else name += i + 1

        const gas = new GasEl(name, gases[i])
        gas.insert()

		gasEls.push(gas)
	}

    const storage = new GasEl("Хранилище", fuelStorage)
    storage.setGreyIcon()
    storage.insert()

    gasEls.push(storage)

	fuelStorage.init(fuelFields)
}

function mainloop() {
	let curIdx = 0

	let timer = setInterval(() => {
		$(".fuel-input").eq(curIdx).attr("disabled", true)

		console.log(curIdx)
		curIdx += 1
	}, config.timeMonth * 1000)
}
