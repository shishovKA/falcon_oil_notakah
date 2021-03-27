import "bootstrap/dist/css/bootstrap.css"
import "./style.css"
import $ from "jquery"
import { config, state, fuelStorage, gases, world } from "./algo-front"

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
	constructor(name, gas) {
		this.gas = gas
		this.name = name
		this.left = 200
		this.right = document.documentElement.clientWidth - 200
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

				const distance = Math.sqrt(
					Math.pow(x - ox, 2) + Math.pow(y - oy, 2)
				)

				if (distance < 100) isLong = false
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
                <div class="gas-card-wrapper">
                    <div class="gas-card card">
                    <div class="card-body">
                        <ul class="staff list-group list-group-horizontal mb-2">
                        </ul>
                        <ul class="fuel list-group mb-2">
                        </ul>
                        <ul class="work-places list-group mb-2">
                        </ul>
                    </div>
                    </div>
                    <div class="transparent-transition"></div>
                </div>
            </div>
        `)
	}

    baseInsert() {
        this.genEl()
		this.style()

        $(".map-container").append(this.el)
    }

	insert() {
		this.genEl()
		this.style()
		this.hover()

		$(".map-container").append(this.el)

		this.renderStaff()
		this.renderFuel()
        this.renderWorkPlaces()
	}

	style() {
		this.el.css("left", this.x)
		this.el.css("top", this.y)
	}

	hover() {
		this.el.on("mouseenter", () => {
			$(".gas-card-wrapper", this.el).css("display", "block")
			$(".gas-card-wrapper", this.el).addClass("show")
		})

		this.el.on("mouseleave", () => {
			$(".gas-card-wrapper", this.el).css("display", "none")
			$(".gas-card-wrapper", this.el).removeClass("show")
		})
	}

	renderStaff() {
		const gasCardStaff = $(".gas-card .staff", this.el)

		gasCardStaff.empty()

		this.gas.staff = this.gas.staff || []

		for (const staff of this.gas.staff) {
			gasCardStaff.append(`
                <li class="list-group-item text-nowrap">
                    ${staff.name()}
                    <span class="badge badge-primary">${staff.salary()}</span>
                </li>
            `)
		}
	}

	renderWorkPlaces() {
		const gasCardWorkPlaces = $(".gas-card .work-places", this.el)

		gasCardWorkPlaces.empty()

        let i = 1;
        for (const workPlace of this.gas.workPlaces) {
            let text = ""
            if (workPlace.isBuild === false) {
                text = `Дней до постройки ${workPlace.beforeBuild}`
            } else {
                text = ""
            }

            gasCardWorkPlaces.append(`
                <li class="list-group-item text-nowrap">
                    Обслуживающее место ${i}
                    <span class="badge badge-primary">${text}</span>
                </li>            
            `)

            i += 1
        }
		
	}

	renderFuel() {
		const gasCardFuel = $(".gas-card .fuel", this.el)

		gasCardFuel.empty()

		gasCardFuel.append(`
            <li class="list-group-item text-nowrap">
                Оставшееся топливо
                <span class="badge badge-primary">${this.gas.fuel}</span>
            </li>
        `)
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
	storage.baseInsert()

	fuelStorage.init(fuelFields)
}

function mainloop() {
	let curIdx = 0
	renderMainList();
	let timer = setInterval(() => {
        world.tick()

		$(".fuel-input").eq(curIdx).attr("disabled", true)

		for (const gasEl of gasEls) {
			gasEl.renderStaff()
			gasEl.renderFuel()
            gasEl.renderWorkPlaces()
		}

		renderMainList();
		curIdx += 1

		if (curIdx === 12) clearInterval(timer)
	}, config.timeMonth * 1000)
}

// for LIST
function renderStationCount() {
	$("#stationCount").text(gasEls.length)
};

function renderBankValue() {
	$("#bankValue").text(state.profit);
};

function renderMainList() {
	renderStationCount();
	renderBankValue();	
}

renderMainList();
