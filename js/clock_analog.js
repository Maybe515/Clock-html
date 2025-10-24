(() => {
    /** Utility: create and append a div */
    const addDiv = (parent, className, callback) => {
        const el = document.createElement("div");
        el.classList.add(className);
        if (typeof callback === "function") callback(el);
        parent.appendChild(el);
        return el;
    };

    /** Create analog clock face */
    const createFace = () => {
        const analog = document.getElementById("analog");
        const [w, h] = [analog.clientWidth, analog.clientHeight];
        const size = Math.min(w, h);

        const face = addDiv(analog, "analog-face", el => {
            el.style.width = el.style.height = `${size}px`;
            el.style.top = `${(h - size) / 2}px`;
            el.style.left = `${(w - size) / 2}px`;
        });

        const radius = size / 2;

        // minute/hour ticks
        for (let i = 0; i < 60; i++) {
            const deg = i * 6; // 360/60
            addDiv(face, i % 5 === 0 ? "analog-line1" : "analog-line2", el => {
                if (i > 0) {
                    el.style.transformOrigin = `${radius}px center`;
                    el.style.transform = `rotate(${deg}deg)`;
                }
            });
        }

        // numbers
        const textRadius = radius - 60;
        for (let i = 0; i < 12; i++) {
            const deg = i * 30; // 360/12
            addDiv(face, "analog-text", el => {
                const rad = (deg * Math.PI) / 180;
                const x = radius + textRadius * Math.sin(rad);
                const y = radius - textRadius * Math.cos(rad);
                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
                el.innerText = i === 0 ? "12" : i.toString();
            });
        }

        addDiv(face, "analog-center");
        return face;
    };

    /** Clock hand class */
    class ClockHand {
        constructor(className, { parent, lengthPercent, gapPercent, divisions }) {
            const radius = parent.clientHeight / 2;
            const length = (radius * lengthPercent) / 100;
            const gap = (radius * gapPercent) / 100;

            this.el = addDiv(parent, className);
            this.el.style.height = `${length + gap}px`;
            this.el.style.top = `${radius - length}px`;
            this.el.style.left = `${radius - this.el.clientWidth / 2}px`;
            this.el.style.transformOrigin = `center ${length}px`;
            this.el.style.transition = "transform 0.5s ease-out";

            this.transforms = Array.from({ length: divisions }, (_, i) => `rotate(${(360 / divisions) * i}deg)`);
            this.currentValue = null;
            this.transitionEnabled = true;
            this.transitionCount = 0;
        }

        setAngle(deg) {
            this.el.style.transform = `rotate(${deg}deg)`;
        }
    }

    /** Init analog clock */
    window.addEventListener("DOMContentLoaded", () => {
        const face = createFace();

        const secondHand = new ClockHand("analog-seconds", {
            parent: face,
            lengthPercent: 85,
            gapPercent: 20
        });

        const minuteHand = new ClockHand("analog-minutes", {
            parent: face,
            lengthPercent: 80,
            gapPercent: 10
        });

        const hourHand = new ClockHand("analog-hours", {
            parent: face,
            lengthPercent: 55,
            gapPercent: 10
        });

        const update = () => {
            const now = new Date();
            const ms = now.getMilliseconds();
            const s = now.getSeconds() + ms / 1000;
            const m = now.getMinutes() + s / 60;
            const h = (now.getHours() % 12) + m / 60;

            // 秒針: 360° / 60秒
            secondHand.setAngle(s * 6);
            // 分針: 360° / 60分
            minuteHand.setAngle(m * 6);
            // 時針: 360° / 12時間
            hourHand.setAngle(h * 30);

            requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    });
})();