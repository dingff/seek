# Seek
A Chrome extension that is similar to the Network panel but enables you to filter network requests by their parameters and add custom columns.

## Motivation
This goes back to a system I came across earlier, which all its APIs used the same name, and the functionalities were distinguished by passing different parameters. When I opened the Network panel, I was overwhelmed by a whole page of requests that looked exactly the same. Unfortunately, Chrome Network couldn't distinguish these requests by their parameters.

## How to use
1. Clone this repository.
2. Run `yarn` to install dependencies, then run `yarn build` to generate the `dist` folder.
3. Go to `chrome://extensions` in your browser, toggle on the `Developer mode` switch. Then click on `Load unpacked` and select the `dist` folder.