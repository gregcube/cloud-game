const settings = (() => {
    const settingsKey = 'settings';
    const revision = 1;
    let isProviderSupported = _isSupported();

    // !to do something if localStorage is unavailable

    let settings = {
        _version: revision
    };

    const _import = () => {
    }

    const _export = (data) => JSON.stringify(data, null, 2);

    const load = () => {
        if (!isProviderSupported) return;

        if (!_hasSettings()) _save();

        settings = _load();

        if (revision !== settings._version) {
            // !to handle this as migrations
        }
    }

    const get = () => settings

    const loadOr = (key, default_) => {
        if (!isProviderSupported) return default_;
        if (settings.hasOwnProperty(key)) return settings[key];

        settings[key] = default_;
        _save();

        return default_;
    }

    function _hasSettings() {
        return localStorage.getItem(settingsKey);
    }

    function _save() {
        localStorage.setItem(settingsKey, _export(settings));
    }

    function _load() {
        return JSON.parse(localStorage.getItem(settingsKey));
    }

    function _isSupported() {
        const testKey = 'test_' + Math.random().toString(36).substring(5);
        try {
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    load();

    return {
        get,
        loadOr,
        import: _import,
        export: _export
    }
})(JSON, localStorage, Math);
