import { sleep, check } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';
import { SharedArray } from 'k6/data';
import { Properties, Setup } from './types';

const props: Properties = new SharedArray('props', () => [JSON.parse(open('./data.json'))]).at(0);

export const options: Options = {
    discardResponseBodies: true,
    scenarios: {
        trapezoid: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '10s', target: 10 },
                { duration: '15s', target: 10 },
                { duration: '5s', target: 0 },
            ],
            gracefulRampDown: '0s',
        },
    }
};

export function setup(): Setup {
    return {
        pauseTest: 1,
        application: {
            baseUrl: props.baseUrl,
            port: props.port,
            endpoints: {
                getWeather: props.weatherService.getWeather,
                getEssay: props.weatherService.getEssay
            }
        },
        data: {
            paragraphs: props.paragraphs,
            waitTime: props.waitTime
        }
    }
}

export default function (setup: Setup) {

    const url = `${setup.application.baseUrl}${setup.application.port}/${setup.application.endpoints.getEssay}`;
    const response = http.get(http.url`${url}?para=${setup.data.paragraphs}&maxWaitTime=${setup.data.waitTime}`);
    
    check(response, {
        'status is 200': () => response.status === 200,
    });

    sleep(setup.pauseTest);
}

export function teardown(setup: Setup) {
    console.log(`Setup data is: ${setup}`)
}