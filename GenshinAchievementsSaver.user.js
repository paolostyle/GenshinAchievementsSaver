// ==UserScript==
// @name         Genshin Achievements Saver
// @namespace    https://github.com/paolostyle/GenshinAchievementsSaver
// @version      0.2.0
// @description  Store Genshin Impact achievements to keep track of hidden ones
// @author       paolostyle
// @license      GNU GPLv3
// @match        https://genshin-impact.fandom.com/wiki/Wonders_of_the_World
// @match        https://genshin-impact.fandom.com/wiki/Memories_of_the_Heart
// @match        https://genshin-impact.fandom.com/wiki/Mortal_Travails:_Series_I
// @match        https://genshin-impact.fandom.com/wiki/Mortal_Travails:_Series_II
// @match        https://genshin-impact.fandom.com/wiki/The_Art_of_Adventure
// @match        https://genshin-impact.fandom.com/wiki/The_Hero%27s_Journey
// @match        https://genshin-impact.fandom.com/wiki/Mondstadt:_The_City_of_Wind_and_Song
// @match        https://genshin-impact.fandom.com/wiki/Liyue:_The_Harbor_of_Stone_and_Contracts
// @match        https://genshin-impact.fandom.com/wiki/Elemental_Specialist
// @match        https://genshin-impact.fandom.com/wiki/Marksmanship
// @match        https://genshin-impact.fandom.com/wiki/Challenger:_Series_I
// @match        https://genshin-impact.fandom.com/wiki/Challenger:_Series_II
// @match        https://genshin-impact.fandom.com/wiki/Challenger:_Series_III
// @match        https://genshin-impact.fandom.com/wiki/Challenger:_Series_IV
// @match        https://genshin-impact.fandom.com/wiki/Domains_and_Spiral_Abyss:_Series_I
// @match        https://genshin-impact.fandom.com/wiki/Olah!:_Series_I
// @match        https://genshin-impact.fandom.com/wiki/Snezhnaya_Does_Not_Believe_in_Tears:_Series_I
// @match        https://genshin-impact.fandom.com/wiki/Stone_Harbor%27s_Nostalgia:_Series_I
// @match        https://genshin-impact.fandom.com/wiki/Meetings_in_Outrealm:_Series_I
// @match        https://genshin-impact.fandom.com/wiki/Meetings_in_Outrealm:_Series_II
// @match        https://genshin-impact.fandom.com/wiki/Visitors_on_the_Icy_Mountain
// @match        https://genshin-impact.fandom.com/wiki/A_Realm_Beyond:_Series_I
// @match        https://genshin-impact.fandom.com/wiki/A_Realm_Beyond:_Series_II
// @match        https://genshin-impact.fandom.com/wiki/A_Realm_Beyond:_Series_III
// @match        https://genshin-impact.fandom.com/wiki/Inazuma:_The_Islands_of_Thunder_and_Eternity_-_Series_I
// @updateURL    https://github.com/paolostyle/GenshinAchievementsSaver/raw/master/GenshinAchievementsSaver.user.js
// @supportURL   https://github.com/paolostyle/GenshinAchievementsSaver/issues
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
  'use strict';

  const localStorageKey = 'gas_achievements';
  const savedState = localStorage.getItem(localStorageKey);
  const state = new Set(JSON.parse(savedState));

  const changeAndStoreState = (action) => {
    action();
    localStorage.setItem(localStorageKey, JSON.stringify([...state]));
    refreshDerivedInfo();
  };
  const setEnabled = (id) => changeAndStoreState(() => state.add(id));
  const updateState = (id) =>
    changeAndStoreState(() => (state.has(id) ? state.delete(id) : state.add(id)));

  function displaySummary() {
    const earnedAchievementsCount = [
      ...document.querySelectorAll('input[type="checkbox"][id^=check]'),
    ].filter((i) => i.checked).length;
    const earnedPrimogemsCount = [...document.querySelectorAll('.gas-owned-primogems')].reduce(
      (total, element) => total + Number(element.textContent),
      0
    );

    const tableTotalAchievements = document.querySelector('.pi-data-value[data-source="total"]');
    const totalAchievementsCount = tableTotalAchievements.textContent.split('/').pop();
    tableTotalAchievements.textContent = `${earnedAchievementsCount}/${totalAchievementsCount}`;

    const tablePrimogems = document.querySelector('.pi-data-value[data-source="primogems"]');
    const totalPrimogemsCount = tablePrimogems.textContent.split('/').pop();
    tablePrimogems.textContent = `${earnedPrimogemsCount}/${totalPrimogemsCount}`;
  }

  function displayTableSummary(table) {
    const checkboxes = [...table.querySelectorAll('tbody > tr input[type="checkbox"][id^=check]')];
    const achieved = checkboxes.reduce((count, input) => count + input.checked, 0);
    const percentValue = (achieved / checkboxes.length).toLocaleString('en', {
      style: 'percent',
    });
    const achievementsStatus = `${achieved}/${checkboxes.length}; ${percentValue}`;

    const footerElement = table.querySelector('tfoot > tr > th:first-child');
    footerElement.textContent = `Total (${achievementsStatus})`;
  }

  function displayTablePrimogems(table) {
    const totalTablePrimogemsOwned = [...table.querySelectorAll('tbody > tr')].reduce(
      (total, row) => {
        const rowAchievements = [...row.querySelectorAll('input')].reduce(
          (count, input) => count + input.checked,
          0
        );
        const rowPrimogems = row
          .querySelector('td:last-child')
          .textContent.split('/')
          .reduce((sum, gems, index) => (index < rowAchievements ? sum + Number(gems) : sum), 0);

        return total + rowPrimogems;
      },
      0
    );

    const primoFooterElement = table.querySelector('tfoot > tr > th:last-child');
    let ownedPrimogemsElement = primoFooterElement.querySelector('.gas-owned-primogems');
    if (!ownedPrimogemsElement) {
      ownedPrimogemsElement = document.createElement('span');
      ownedPrimogemsElement.className = 'gas-owned-primogems';
      primoFooterElement.textContent = `/${primoFooterElement.textContent}`;
      primoFooterElement.prepend(ownedPrimogemsElement);
    }

    ownedPrimogemsElement.textContent = totalTablePrimogemsOwned;
  }

  function refreshDerivedInfo() {
    document.querySelectorAll('.article-table').forEach((table) => {
      displayTableSummary(table);
      displayTablePrimogems(table);
    });

    displaySummary();
  }

  function addTableHeaders() {
    document.querySelectorAll('.article-table thead > tr').forEach((headerRow) => {
      const content = document.createElement('span');
      content.textContent = 'Select all';
      content.style.cursor = 'pointer';
      content.addEventListener('click', () => {
        const table = headerRow.parentNode.parentNode;
        table.querySelectorAll('tbody > tr').forEach((row) => {
          row.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.checked = true;
            setEnabled(checkbox.value);
          });
        });
      });

      const headerCell = document.createElement('th');
      headerCell.style.textAlign = 'center';
      headerCell.append(content);
      headerRow.prepend(headerCell);
    });
  }

  function appendCheckboxes() {
    document.querySelectorAll('.article-table tbody > tr').forEach((row) => {
      if (!row.id) {
        const cellToId = (str) => encodeURIComponent(str.replaceAll(' ', '_')).replaceAll('%', '.');
        const achievementNameCell = row.firstElementChild;
        achievementNameCell.setAttribute('id', cellToId(achievementNameCell.textContent));
      }

      const primogemsCell = row.querySelector('td:last-child').textContent;
      const achievementLevels = primogemsCell.split('/').map((_, index) => index + 1);

      const checkboxes = achievementLevels.map((level) => {
        const checkbox = document.createElement('input');
        const value = `${row.id}___${level}`;
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('value', value);
        checkbox.setAttribute('id', `check_${value}`);
        checkbox.checked = state.has(value);
        checkbox.addEventListener('change', () => updateState(value));

        return checkbox;
      });

      const cell = document.createElement('td');
      cell.style.textAlign = 'center';
      cell.append(...checkboxes);

      row.prepend(cell);
    });
  }

  function adjustFooters() {
    document.querySelectorAll('.article-table tfoot > tr > th:first-child').forEach((footer) => {
      footer.setAttribute('colspan', Number(footer.getAttribute('colspan')) + 1);
      footer.style.textAlign = 'left';
    });
  }

  function runScripts() {
    addTableHeaders();
    appendCheckboxes();
    adjustFooters();
    refreshDerivedInfo();
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  window.addEventListener(
    'load',
    async () => {
      const isReady = () => document.querySelectorAll('.article-table thead').length > 0;
      let counter = 0;
      while (!isReady() && counter < 10) {
        counter += 1;
        await sleep(300);
      }
      if (counter !== 10) {
        runScripts();
      } else {
        throw new Error('Could not initialize Achievements script.');
      }
    },
    false
  );
})();
