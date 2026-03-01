import zxcvbn from 'zxcvbn';

self.onmessage = function (e) {
    const password = e.data;
    if (!password) {
        self.postMessage(null);
        return;
    }
    const result = zxcvbn(password);
    self.postMessage(result);
};
