// ==UserScript==
// @name         Genshin Achievements Saver
// @namespace    https://github.com/paolostyle/GenshinAchievementsSaver
// @version      0.1.0
// @description  Store Genshin Impact achievements to keep track of hidden ones
// @author       paolostyle
// @license      GNU GPLv3
// @match        https://genshin-impact.fandom.com/wiki/Achievements
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
    const totalAchievementsCount = [
      ...document.querySelectorAll('input[type="checkbox"][id^=check]'),
    ].filter((i) => i.checked).length;
    const totalPrimogemsCount = [...document.querySelectorAll('.gas-owned-primogems')].reduce(
      (total, element) => total + Number(element.textContent),
      0
    );

    let summaryNode = document.querySelector('.gas-summary');
    if (!summaryNode) {
      const toc = document.querySelector('#toc');
      summaryNode = document.createElement('p');
      summaryNode.className = 'gas-summary';
      toc.parentNode.insertBefore(summaryNode, toc);
    }
    summaryNode.textContent = `So far you completed ${totalAchievementsCount} achievements, which granted you ${totalPrimogemsCount} Primogems.`;
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
      if (row.id) {
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
      }
    });
  }

  function adjustFooters() {
    document.querySelectorAll('.article-table tfoot > tr > th:first-child').forEach((footer) => {
      footer.setAttribute('colspan', Number(footer.getAttribute('colspan')) + 1);
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
