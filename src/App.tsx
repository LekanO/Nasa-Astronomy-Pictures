import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { backdateByDays } from "./libs/backdateByDays";
import { formatDate } from "./libs/formatDate";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  copyright: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

function App() {
  const [images, setImages] = useState<Props[]>([]);
  const [image, setImage] = useState<Props>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [startDate, setStartDate] = useState(new Date());
  const start_date = backdateByDays(6);
  const end_date = backdateByDays(0);
  let apiUrl = new URL("/planetary/apod", process.env.REACT_APP_NASA_BASE_URL);

  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get("date")?.toString();

  const fetchImages = async () => {
    apiUrl.searchParams.append(
      "api_key",
      String(process.env.REACT_APP_NASA_API)
    );
    if (!dateParam) {
      apiUrl.searchParams.append("start_date", start_date);
      apiUrl.searchParams.append("end_date", end_date);
    }
    return await fetch(apiUrl.href)
      .then((response) => response)
      .then((e) => e.json())
      .then((e) => {
        setImages(e);
      });
  };

  const fetchImage = async (date: Date) => {
    const dateQuery = formatDate(String(date));

    apiUrl.searchParams.append(
      "api_key",
      String(process.env.REACT_APP_NASA_API)
    );
    apiUrl.searchParams.delete("start_date");
    apiUrl.searchParams.delete("end_date");
    apiUrl.searchParams.append("date", dateQuery);

    return await fetch(apiUrl.href)
      .then((response) => response)
      .then((e) => e.json())
      .then((e) => {
        setImage(e);
      });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="App">
      <section className="Main">
        <div className="Main-datepicker">
          <DatePicker
            selected={new Date(startDate)}
            onChange={(date) => {
              if (!date) return;
              const dateQuery = formatDate(String(date));
              fetchImage(date);
              setStartDate(date);
              if (!date) return;
              // setStartDate(date);
              setSearchParams({ date: dateQuery });
            }}
          />
          <br />
        </div>
        <div className="Main-display">
          <img
            className="Main-image"
            src={image ? image.hdurl : images[5]?.hdurl}
          />
        </div>
      </section>
      <Outlet />
    </div>
  );
}

export default App;
