# Genshin Achievements Saver
Tampermonkey script for saving achievements in local storage

## About
[Genshin Impact](https://genshin.mihoyo.com/en) is a popular multiplatform action video game, which I'm playing quite a lot recently. Like many games nowadays it contains **achievements** and many of them (the ones listed under category Wonders of the World in game) are hidden. However there is an article on [Genshin Impact Wiki](https://genshin-impact.fandom.com/wiki/Achievements), probably one of the more popular resources about the game, which contains the list of achievements available in the game and it's kept up to date by the community.

Some time before 2.0 version of Genshin Impact the Achievements page has been split into separate articles, so you have to visit a category first to use the script. All the categories available on 2021-08-08 (ver. 2.0 of the game) are supported.

Here's where my script comes in - obviously, as it's a Wiki page, it only contains the *list* of the achievements, with the script you can track them on that page. It looks like this:

![image](https://user-images.githubusercontent.com/8234991/116486950-19b4c880-a88f-11eb-905f-883de656f127.png)

You simply click the checkbox on the left if you completed the achievement and it will stay there **unless you clear your local storage**, but it shouldn't happen unless you do it intentionally.

If the achievement has multiple levels (like e.g. `QUEST CLEAR` one on the screenshot) you'll see multiple checkboxes. There's also a summary for each group of achievements in the article (in the example above: `9/9; 100%`) and you can see how many Primogems you earned for completing them (`115/115` in the example above). If you completed all of the achievements in the group you can click `Select all` in the table header, that will select all checkboxes for you.

**IMPORTANT: You have to select the achievements manually first, it will NOT automagically synchronize your achievements from the game.**

The script also updates the infobox on the top right side of the article with summary of the achievements:

![image](https://user-images.githubusercontent.com/8234991/128617232-5f0f55cb-020d-41ba-9288-c5480936e640.png)

## Installation
First, you need to install [Tampermonkey](https://www.tampermonkey.net/) for your browser. After you're done, you should be able to install the extension simply by **[clicking here](https://github.com/paolostyle/GenshinAchievementsSaver/raw/master/GenshinAchievementsSaver.user.js)** or by navigating to **[GenshinAchievementsSaver.user.js](https://github.com/paolostyle/GenshinAchievementsSaver/blob/master/GenshinAchievementsSaver.user.js)** file in this repo and clicking *Raw* button in the top right corner, just above the source code. Then go to **[Genshin Impact Wiki Achievements page](https://genshin-impact.fandom.com/wiki/Achievements)**, select a category from the list and you'll be able to manage your achievements there.

I'm not sure about the updates, but I *think* they should be automatic.

## Notes
The code was hacked together in about half a day so the quality of code is quite low but I might come back to this at some point and that's probably when I'll release v1.0.0.

## License
GNU GPL v3