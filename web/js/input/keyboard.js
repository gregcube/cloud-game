/**
 * Keyboard controls.
 *
 * @version 1
 */
const keyboard = (() => {
    const KEYBOARD_MAP = settings.get().input.keyboard.map;

    const onKey = (code, callback) => {
        if (code in KEYBOARD_MAP) callback(KEYBOARD_MAP[code]);
    };

    return {
        init: () => {
            const body = $('body');
            body.on('keyup', ev => onKey(ev.keyCode, key => event.pub(KEY_RELEASED, {key: key})));
            body.on('keydown', ev => onKey(ev.keyCode, key => event.pub(KEY_PRESSED, {key: key})));
            log.info('[input] keyboard has been initialized');
        }
    }
})(event, settings);
