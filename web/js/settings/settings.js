const settings = (() => {

    const _default = {
        input: {
            keyboard: {
                map: {
                    37: KEY.LEFT,
                    38: KEY.UP,
                    39: KEY.RIGHT,
                    40: KEY.DOWN,
                    90: KEY.A, // z
                    88: KEY.B, // x
                    67: KEY.X, // c
                    86: KEY.Y, // v
                    65: KEY.L, // a
                    83: KEY.R, // s
                    13: KEY.START, // enter
                    16: KEY.SELECT, // shift
                    // non-game
                    81: KEY.QUIT, // q
                    87: KEY.JOIN, // w
                    75: KEY.SAVE, // k
                    76: KEY.LOAD, // l
                    49: KEY.PAD1, // 1
                    50: KEY.PAD2, // 2
                    51: KEY.PAD3, // 3
                    52: KEY.PAD4, // 4
                    70: KEY.FULL, // f
                    72: KEY.HELP, // h
                    220: KEY.STATS, // backspace
                }
            }
        }
    }
    let _defaultKeys = Object.keys(_default);

    let settings = {};

    const _import = () => {

    }

    const _export = (key) => {
        return JSON.stringify(_default[key], null, 2);
    }

    const load = () => {
        let _settings = {};

        for (let key of _defaultKeys) {
            if (!localStorage.getItem('settings.' + key)) {
                localStorage.setItem('settings.' + key, _export(key));
            }
            _settings[key] = JSON.parse(localStorage.getItem('settings.'+key));
        }

        settings = _settings;
    }

    const get = () => settings

    load();

    return {
        get,
        import: _import,
        export: _export
    }
})(KEY);
