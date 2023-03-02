#!/usr/bin/env python
# pylint: disable=unused-argument, wrong-import-position
# This program is dedicated to the public domain under the CC0 license.

"""
First, a few callback functions are defined. Then, those functions are passed to
the Application and registered at their respective places.
Then, the bot is started and runs until we press Ctrl-C on the command line.

Usage:
Example of a bot-user conversation using ConversationHandler.
Send /start to initiate the conversation.
Press Ctrl-C on the command line or send a signal to the process to stop the
bot.
"""

import os
import json
import logging
import sys
import traceback

from telegram import __version__ as TG_VER

try:
	from telegram import __version_info__
except ImportError:
	__version_info__ = (0, 0, 0, 0, 0)	# type: ignore[assignment]

if __version_info__ < (20, 0, 0, "alpha", 5):
	raise RuntimeError(
		f"This example is not compatible with your current PTB version {TG_VER}. To view the "
		f"{TG_VER} version of this example, "
		f"visit https://docs.python-telegram-bot.org/en/v{TG_VER}/examples.html"
	)
from telegram import ReplyKeyboardMarkup, InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardRemove, Update, WebAppInfo, KeyboardButton
from telegram.ext import (
	Application,
	CommandHandler,
	ContextTypes,
	ConversationHandler,
	MessageHandler,
	filters,
)


# Enable logging
logging.basicConfig(
	format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

GENDER, PHOTO, LOCATION, BIO = range(4)

# TOKEN = "we inserted token here manually"

try:
	with open('../../tg_key.json','r') as f:
		json_tg_key = json.load(f)
		TOKEN = json_tg_key['key']

except Exception as e:
	print(traceback.format_exc())
	TOKEN = input('Put in token here:')

START, ASK, CONNECT, WAIT = range(4)
db = {}
chats = {}


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:

	receive_message(update)
	await update.message.reply_text("Welcome to TeleFi",reply_markup=ReplyKeyboardRemove())

	# Code some logic to check if the user has to recieve, check if it's screen name instead
	if update.effective_chat.id in db:
		await update.message.reply_text(
		"Siddarth has requested you pay $%s!" % (db[1636816177]),
		reply_markup=InlineKeyboardMarkup.from_button(
			InlineKeyboardButton(
				text="Click to connect wallet"),
				web_app=WebAppInfo(url="https://telefi-staging.vercel.app"),
			)
		)
		# Keyboard here
		return EXIT

	await update.message.reply_text("Type $ amount for payment")
	return START


	#return GENDER

"""
async def ask(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
	user = update.message.from_user
	logger.info("Gender of %s: %s", user.first_name, update.message.text)
	await update.message.reply_text(
		"I see! Please send me a photo of yourself, "
		"so I know what you look like, or send /skip if you don't want to.",
		reply_markup=ReplyKeyboardRemove(),
	)
	await update.message.reply_text(
		".",
		reply_markup=InlineKeyboardMarkup.from_button(
			KeyboardButton(
				text="Open the color picker!",
				web_app=WebAppInfo(url="https://python-telegram-bot.org/static/webappbot"),
			)
		),
	)
	return PHOTO
"""


async def photo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
	"""Stores the photo and asks for a location."""
	user = update.message.from_user
	photo_file = await update.message.photo[-1].get_file()
	await photo_file.download_to_drive("user_photo.jpg")
	logger.info("Photo of %s: %s", user.first_name, "user_photo.jpg")
	await update.message.reply_text(
		"Gorgeous! Now, send me your location please, or send /skip if you don't want to."
	)

	return LOCATION


async def skip_photo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
	"""Skips the photo and asks for a location."""
	user = update.message.from_user
	logger.info("User %s did not send a photo.", user.first_name)
	await update.message.reply_text(
		"I bet you look great! Now, send me your location please, or send /skip."
	)

	return LOCATION


async def location(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
	"""Stores the location and asks for some info about the user."""
	user = update.message.from_user
	user_location = update.message.location
	logger.info(
		"Location of %s: %f / %f", user.first_name, user_location.latitude, user_location.longitude
	)
	await update.message.reply_text(
		"Maybe I can visit you sometime! At last, tell me something about yourself."
	)

	return BIO


async def skip_location(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
	"""Skips the location and asks for info about the user."""
	user = update.message.from_user
	logger.info("User %s did not send a location.", user.first_name)
	await update.message.reply_text(
		"You seem a bit paranoid! At last, tell me something about yourself."
	)

	return BIO


async def bio(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
	"""Stores the info about the user and ends the conversation."""
	user = update.message.from_user
	logger.info("Bio of %s: %s", user.first_name, update.message.text)
	await update.message.reply_text("Thank you! I hope we can talk again some day.")

	return ConversationHandler.END


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
	"""Cancels and ends the conversation."""
	user = update.message.from_user
	logger.info("User %s canceled the conversation.", user.first_name)
	await update.message.reply_text(
		"Bye! I hope we can talk again some day.", reply_markup=ReplyKeyboardRemove()
	)

	return ConversationHandler.END

async def ask(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
	receive_message(update)
	await update.message.reply_text("%s Received, connect wallet here" % update.message.text)
	await update.message.reply_text(
		"Link wallet to recceive payments",
		reply_markup=InlineKeyboardMarkup.from_button(
			InlineKeyboardButton(
				text="Connect wallet here!",
				#web_app=WebAppInfo(url="https://app.uniswap.org/#/swap?exactField=input&exactAmount=0.8&inputCurrency=ETH&outputCurrency=0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"),
				web_app=WebAppInfo(url="https://telefi-staging.vercel.app"),
			)
		),
	)
	return ASK



async def wait(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
	receive_message(update)
	await update.message.reply_text("Wait")
	return WAIT


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
	receive_message(update)
	await update.message.reply_text("Wait")
	return WAIT

async def jiggle(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
	receive_message(update)
	await update.message.reply_text("Wait")
	return WAIT

async def connect(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
	receive_message(update)
	"""Send a message with a button that opens a the web app."""
	await update.message.reply_text(
		"Please press button below to connect wallet.",
		reply_markup=ReplyKeyboardMarkup.from_button(
			KeyboardButton(
				text="Connect wallet here!",
				web_app=WebAppInfo(url="https://telefi-staging.vercel.app"),
			)
		),
	)
	return ASK

# Handle incoming WebAppData
async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
	"""Print the received data and remove the button."""
	print(update)
	# Here we use `json.loads`, since the WebApp sends the data JSON serialized string
	# (see webappbot.html)
	data = json.loads(update.effective_message.web_app_data.data)
	await update.message.reply_html(
		text=f"You selected the color with the HEX value <code>{data['hex']}</code>. The "
		f"corresponding RGB value is <code>{tuple(data['rgb'].values())}</code>.",
		reply_markup=ReplyKeyboardRemove(),
	)

def receive_message(update):

    # Getting data from keyboard or message
    if update.callback_query:
        text = update.callback_query.data
    else:
        text = update.message.text.replace('\n','\\n')
    # If this user has been logged in chats
    if update.effective_chat.id in chats:
        user = chats[update.effective_chat.id]
        #user.last_seen = datetime.now()
        #.logger.info('Logging - %s - %s received: %s' % (update.effective_chat.id, user.email, text))
        print('Logging - %s received: %s' % (update.effective_chat.id, text))
        return user
    else:
        logger.info('Logging - %s received: %s' % (update.effective_chat.id, text))


def main() -> None:
	"""Run the bot."""
	# Create the Application and pass it your bot's token.
	application = Application.builder().token(TOKEN).build()

	# Add conversation handler with the states GENDER, PHOTO, LOCATION and BIO
	conv_handler = ConversationHandler(
		entry_points=[CommandHandler("start", start)],
		states={
			START: [MessageHandler(filters.ALL, ask)],
			CONNECT: [MessageHandler(filters.ALL, connect)],
			ASK: [MessageHandler(filters.ALL, connect)],
			LOCATION: [
				MessageHandler(filters.LOCATION, location),
				CommandHandler("skip", skip_location),
			],
			BIO: [MessageHandler(filters.TEXT & ~filters.COMMAND, bio)],
		},
		fallbacks=[CommandHandler("cancel", cancel)],
	)

	application.add_handler(conv_handler)
	application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))

	# Run the bot until the user presses Ctrl-C
	application.run_polling()


if __name__ == "__main__":
	if '-t' in sys.argv:
		db[1636816177] = 100
	main()
