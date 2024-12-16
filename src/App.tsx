import { useEffect, useState } from "react";
import { Indicador, IndicadorProps } from "./components/indicador";
import { Item, Tabla } from "./components/tabla";
import { MapPinIcon, MapPinnedIcon, NavigationIcon } from "lucide-react";
import { Grafico, TemperatureData } from "./components/grafico";

function App() {
  const [indicadores, setIndicadores] = useState<IndicadorProps[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [temperatureData, setTemperatureData] = useState<TemperatureData[]>([]);

  useEffect(() => {
    (async () => {
      const dataToItems = [];

      const API_KEY = "bee5c920ab365064c44f7d1f53294669";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`
      );
      const dataText = await response.text();

      if (dataText) {
        const parser = new DOMParser();
        const dataXML = parser.parseFromString(dataText, "application/xml");

        const dataToIndicators: IndicadorProps[] = [];

        const name = dataXML.getElementsByTagName("name")[0].innerHTML || "";

        dataToIndicators.push({
          title: name,
          description: "City",
          icon: <MapPinnedIcon size={18} />,
        });

        const location = dataXML.getElementsByTagName("location")[1];

        const latitude = location.getAttribute("latitude") || "";

        dataToIndicators.push({
          title: latitude,
          description: "Latitude",
          icon: <MapPinIcon size={18} />,
        });

        const longitude = location.getAttribute("longitude") || "";

        dataToIndicators.push({
          title: longitude,
          description: "Longitude",
          icon: <MapPinIcon size={18} />,
        });

        const altitude = location.getAttribute("altitude") || "";

        dataToIndicators.push({
          title: altitude,
          description: "Altitude",
          icon: <NavigationIcon size={18} />,
        });

        setIndicadores(dataToIndicators);

        for (let i = 0; i < 6; i++) {
          const timeTag = dataXML.getElementsByTagName("time")[i];

          const dateStart = timeTag.getAttribute("from");
          const dateEnd = timeTag.getAttribute("to");

          const precipitation = timeTag
            .getElementsByTagName("precipitation")[0]
            .getAttribute("probability");
          const humidity = timeTag
            .getElementsByTagName("humidity")[0]
            .getAttribute("value");
          const clouds = timeTag
            .getElementsByTagName("clouds")[0]
            .getAttribute("all");

          dataToItems.push({
            dateStart,
            dateEnd,
            precipitation,
            humidity,
            clouds,
          });
        }

        setItems(dataToItems);

        const timeNodes = dataXML.getElementsByTagName("time");
        const tempData = [];

        for (let i = 0; i < timeNodes.length; i++) {
          const timeNode = timeNodes[i];
          let fromHour = timeNode.getAttribute("from") || ""; // Hour range
          const date = new Date(fromHour);
          date.setHours(date.getHours() - 5); // Ecuador time zone
          fromHour = date.toISOString();

          const tempNode = timeNode.getElementsByTagName("temperature")[0];
          const temperature = tempNode.getAttribute("value") || "";

          tempData.push({
            hour: fromHour,
            temperature: (parseFloat(temperature) - 273.15).toFixed(2), // Kelvin to Celsius
          });
        }

        setTemperatureData(tempData);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col w-full h-svh overflow-hidden gap-10 p-12">
      <header>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          OpenWeatherMap
        </h1>
      </header>
      <main className="flex w-full flex-1 flex-col gap-10 px-5">
        <div className="flex gap-16 justify-center items-center px-36">
          {indicadores.map((data, index) => (
            <Indicador key={index} {...data} />
          ))}
        </div>

        <div className="flex flex-1 gap-10">
          <div className="flex-1">
            <Tabla items={items} />
          </div>

          <div className="flex-1">
            <Grafico chartData={temperatureData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

