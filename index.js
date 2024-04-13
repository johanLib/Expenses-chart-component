const ctx = document.querySelector(".chart__chart");

const plugin = {
    id: "customCanvasBackgroundColor",
    beforeDraw: (chart, args, options) => {
        const { ctx } = chart;
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = options.color || "#99ffff";
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
    },
};

const api = fetch("data.json")
    .then((res) => res.json())
    .then((items) => {
        let data = [];
        let labels = [];
        items.forEach((item) => {
            data.push(item.amount);
            labels.push(item.day);
        });
        const maxValue = Math.max(...data);
        let backgroundColors = data.map((value) => {
            if (value === maxValue) {
                return "#76b5bc";
            } else {
                return "#ec775f";
            }
        });

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "",
                        data: data,
                        borderWidth: 0,
                        borderRadius: 3,
                        borderSkipped: false,
                        backgroundColor: backgroundColors,
                        hoverBackgroundColor: [
                            "#f6b0a2",
                            "#f6b0a2",
                            "#a0dae0",
                            "#f6b0a2",
                            "#f6b0a2",
                            "#f6b0a2",
                            "#f6b0a2",
                        ],
                    },
                ],
            },
            options: {
                barPercentage: 0.95,
                onHover: function (event, elements) {
                    var chart = this;
                    if (elements && elements.length) {
                        chart.canvas.style.cursor = "pointer";
                    } else {
                        chart.canvas.style.cursor = "default";
                    }
                },
                plugins: {
                    customCanvasBackgroundColor: {
                        color: "transparent",
                    },
                    legend: false,
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            title: function () {
                                return "";
                            },
                            label: function (context) {
                                let label = context.dataset.label || "";
                                if (label) {
                                    label += ": ";
                                }
                                label += "$" + context.formattedValue;
                                return label;
                            },
                        },
                        bodyFont: {
                            size: 20,
                        },
                    },
                },
                scales: {
                    y: {
                        display: false,
                        beginAtZero: true,
                        grid: {
                            display: false,
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            font: {
                                family: "DM Sans",
                                size: 14, 
                                bodyColor: "#fff",
                            },
                        },
                    },
                },
            },
            plugins: [plugin],
        });
    });
