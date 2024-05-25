export interface Application {
    baseUrl: string,
    port: string,
    endpoints: {
        getWeather: string,
        getEssay: string
    }
}

export interface Setup {
    pauseTest: number,
    application: Application,
    data: {
        paragraphs: number,
        waitTime: number,
    }
}

export interface Properties {
    baseUrl:        string;
    port:           string;
    weatherService: WeatherService;
    paragraphs:     number;
    waitTime:       number;
}

export interface WeatherService {
    getWeather: string;
    getEssay:   string;
}
