/**
 * Game list module.
 * @version 1
 */
const gameList = (() => {
    // state
    let games = [];
    let allGames = [];
    let gameIndex = 1;
    let gamePickTimer = null;

    // UI
    const listBox = $('#menu-container');
    const menuItemChoice = $('#menu-item-choice');
    const alphabetPager = $('#alphabet-pager');
    const letterChoice = $('#letter-choice');

    const MENU_TOP_POSITION = 102;
    let menuTop = MENU_TOP_POSITION;

    const setGames = (gameList) => {
        games = gameList.sort((a, b) => a > b ? 1 : -1);
    };

    const render = () => {
        log.debug('[games] load game menu');

        alphabetPager.append('<div class="menu-item">');

        for (let i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
          let letter = String.fromCharCode(i);

          alphabetPager
            .children('.menu-item')
            .append(`<span class="letter" data-letter="${letter}">${letter}</span>`);
        }

        alphabetPager.append('</div>');

        populateListBox(games);
    };

    const populateListBox = (gamelist) => {
      listBox.html(
        gamelist
          .map(game => `<div class="menu-item unselectable" unselectable="on"><div><span>${game}</span></div></div>`)
          .join(''));
    };

    const resetGameList = () => {
      if (allGames.length) {
        letterChoice.hide();
        alphabetPager.animate({marginLeft: 0}, 200);
        alphabetPager.find('.active').removeClass('active');
        setGames(allGames);
        populateListBox(games);
        pickGame(1);
      }
    };

    const pickLetter = (leftDirection) => {
      let cur = alphabetPager.find('.active');
      letterChoice.show();

      // Keep a copy of all games.
      if (!allGames.length) allGames = [...games];

      if (!cur.length) {
        alphabetPager
          .children()
          .children('.letter:first-child')
          .addClass('active')
          .animate({marginLeft: 0}, 200);
      }
      else {
        cur.removeClass('active');

        if (leftDirection) {
          if (cur.data('letter') == 'Z') {
            cur.parent().children(':first-child').addClass('active');
            alphabetPager.animate({marginLeft: 0}, 200);
          }
          else {
            cur.next().addClass('active');
            alphabetPager.animate({marginLeft: '-=25px'}, 200);
          }
        }
        else {
          if (cur.data('letter') == 'A') {
            cur.parent().children(':last-child').addClass('active');
            alphabetPager.animate({marginLeft: '-625px'}, 200);
          }
          else {
            cur.prev().addClass('active');
            alphabetPager.animate({marginLeft: '+=25px'}, 200);
          }
        }
      }

      let letter = alphabetPager.find('.active').data('letter');
      let list = allGames.filter(game => game.toUpperCase().startsWith(letter));

      setGames(list);
      pickGame(0);
      populateListBox(list);
    };

    const show = () => {
        render();
        menuItemChoice.show();
        pickGame();
    };

    const hide = () => {
        menuItemChoice.hide();
    };

    const pickGame = (index) => {
        let idx = undefined !== index ? index : gameIndex;

        // check boundaries
        // cycle
        if (idx < 0) idx = games.length - 1;
        if (idx >= games.length) idx = 0;

        // transition menu box
        listBox.css('transition', 'top 0.2s');
        listBox.css('-moz-transition', 'top 0.2s');
        listBox.css('-webkit-transition', 'top 0.2s');

        menuTop = MENU_TOP_POSITION - idx * 36;
        listBox.css('top', `${menuTop}px`);

        // overflow marquee
        $('.menu-item .pick').removeClass('pick');
        $(`.menu-item:eq(${idx + 1}) span`).addClass('pick');

        gameIndex = idx;
    };

    const startGamePickerTimer = (upDirection) => {
        if (gamePickTimer !== null) return;

        log.debug('[games] start game picker timer');
        const shift = upDirection ? -1 : 1;
        pickGame(gameIndex + shift);

        // velocity?
        // keep rolling the game list if the button is pressed
        gamePickTimer = setInterval(() => {
            pickGame(gameIndex + shift);
        }, 200);
    };

    const stopGamePickerTimer = () => {
        if (gamePickTimer === null) return;

        log.debug('[games] stop game picker timer');
        clearInterval(gamePickTimer);
        gamePickTimer = null;
    };

    const onMenuPressed = (newPosition) => {
        listBox.css('transition', '');
        listBox.css('-moz-transition', '');
        listBox.css('-webkit-transition', '');
        listBox.css('top', `${menuTop - newPosition}px`);
    };

    const onMenuReleased = (position) => {
        menuTop -= position;
        const index = Math.round((menuTop - MENU_TOP_POSITION) / -36);
        pickGame(index);
    };

    event.sub(MENU_PRESSED, onMenuPressed);
    event.sub(MENU_RELEASED, onMenuReleased);

    return {
        startGamePickerTimer: startGamePickerTimer,
        stopGamePickerTimer: stopGamePickerTimer,
        pickGame: pickGame,
        pickLetter: pickLetter,
        show: show,
        hide: hide,
        set: setGames,
        resetGameList: resetGameList,
        getCurrentGame: () => games[gameIndex]
    }
})($, event, log);
