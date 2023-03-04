from flask import Flask

app = Flask(__name__)


@app.route('/')
def home():
	return 'Home Page Route'


@app.route('/about')
def about():
	return 'About Page Route'


@app.route('/portfolio')
def portfolio():
	return 'Portfolio Page Route'


@app.route('/contact')
def contact():
	return 'Contact Page Route'

@app.route('/start_bot')
def start_bot():
	main()
	return 'Started bot'

@app.route('/api')
def api():
	with open('data.json', mode='r') as my_file:
		text = my_file.read()
		return text

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

"""
try:
	with open('../../tg_key.json','r') as f:
		json_tg_key = json.load(f)
		TOKEN = json_tg_key['key']

except Exception as e:
"""
print(traceback.format_exc())
#TOKEN = input('Put in token here:')
TOKEN = '6235687852:AAGIvf_wHhFjIVw3qmBPmF9--wBp-oXMoFw'

START, ASK, ASKHANDLE, CONNECT, WAIT = range(5)
db = {}
prev_users = {} 
chats = {}


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:

	receive_message(update)
	await update.message.reply_text("Welcome to TeleFi",reply_markup=ReplyKeyboardRemove())

	# Code some logic to check if the user has to recieve, check if it's screen name instead

	if update.message.chat.username.lower() in db:
		await update.message.reply_text(
			"@ has requested you pay $%s!" % (db[update.message.chat.username.lower()]),
			reply_markup=ReplyKeyboardMarkup.from_button(
				KeyboardButton(
					text="Click to pay!",
					#web_app=WebAppInfo(url="https://app.uniswap.org/#/swap?exactField=input&exactAmount=0.8&inputCurrency=ETH&outputCurrency=0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"),
					web_app=WebAppInfo(url="https://telefi-staging.vercel.app"),
				)
			),
		)

		"""
		await update.message.reply_text(
		"@ has requested you pay $%s!" % (db[update.message.chat.username.lower()]),
		reply_markup=ReplyKeyboardMarkup.from_button(
			KeyboardButton(
				text="Click to connect wallet"),
				web_app=WebAppInfo(url="https://telefi-staging.vercel.app"),
			)
		)
		"""
		# Keyboard here
		return EXIT

	await update.message.reply_text("Type $ amount for payment")
	return START


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
	num = string_to_number(update.message.text)
	if num:
		await update.message.reply_text("$%s Received\n\nType user handle @ to request money from" % update.message.text)
		db[update.message.chat.username.lower()] = num
		"""
		await update.message.reply_text(
			"Link wallet to receive payments 1",
			reply_markup=ReplyKeyboardMarkup.from_button(
				KeyboardButton(
					text="Connect wallet here!",
					#web_app=WebAppInfo(url="https://app.uniswap.org/#/swap?exactField=input&exactAmount=0.8&inputCurrency=ETH&outputCurrency=0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"),
					web_app=WebAppInfo(url="https://telefi-staging.vercel.app"),
				)
			),
		)
		"""
		return ASKHANDLE
	else:
		await update.message.reply_text("`%s` is not a valid number" % update.message.text)
		return START
		
	

def string_to_number(string):
    try:
        number = float(string)
        return number
    except ValueError:
        print(f"{string} is not a valid number")
        return None

def strip_url(url):
    last_bit = url.split('/')[-1]
    return last_bit

async def wait(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
	receive_message(update)
	await update.message.reply_text("Wait")
	return WAIT


async def handle(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
	receive_message(update)
	#await update.message.reply_text("Send user handle to request payment from")
	try:
		user_handle = strip_url(update.message.text)
		db[user_handle.lower()] = update.message.chat.username.lower()
		prev_users[update.message.chat.username.lower()] = user_handle.lower()

	except Exception as e:
		print(e)
	await update.message.reply_text(
			"Link wallet to receive payments 2",
			reply_markup=ReplyKeyboardMarkup.from_button(
				KeyboardButton(
					text="Connect wallet here!",
					#web_app=WebAppInfo(url="https://app.uniswap.org/#/swap?exactField=input&exactAmount=0.8&inputCurrency=ETH&outputCurrency=0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"),
					web_app=WebAppInfo(url="https://telefi-staging.vercel.app"),
				)
			),
		)
	return CONNECT

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
	#db[user_handle] = db[update.message.chat.username]
	"""Send a message with a button that opens a the web app."""

	data = json.loads(update.effective_message.web_app_data.data)

	data = data['hi']

	await update.message.reply_html(
		text= "<a href='https://t.me/share/url?url=@tele_fi_bot&text=You%%20owe%%20@%s%%20%.2f%%20click%%20the%%20link%%20above%%20to%%20send'>Click this link</a> to share with @%s" % (update.message.chat.username, db[update.message.chat.username.lower()], prev_users[update.message.chat.username.lower()]),
        #text = "https://t.me/share/url?url=@tele_fi_bot&text=You%%20owe%%20@%s%%20%.2f" % (update.message.chat.username, db[update.message.chat.username.lower()]),
        reply_markup=ReplyKeyboardRemove(),
    )

	"""
	await update.message.reply_text(
        "Share with user you're requesting money from",
        reply_markup=InlineKeyboardMarkup.from_button(
            InlineKeyboardButton(
                text="You owe money",
				switch_inline_query= 'share'
				)	
            )
        )

	await update.message.reply_html(
        text= "Wallet address to receive payment: %s" % data,
        reply_markup=ReplyKeyboardRemove(),
    )
	await update.message.reply_text(
		"Wallet address to receive payment: %s" % data,
		reply_markup=ReplyKeyboardMarkup.from_button(
			KeyboardButton(
				text="Connect wallet here!",
				#request_user='@hitenp1'
				request_chat=True
				#web_app=WebAppInfo(url="https://telefi-staging.vercel.app"),
			)
		),
	)
	"""

	return ASK

# Handle incoming WebAppData
async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
	"""Print the received data and remove the button."""
	print(update)
	# Here we use `json.loads`, since the WebApp sends the data JSON serialized string
	# (see webappbot.html)
	data = json.loads(update.effective_message.web_app_data.data)
	await update.message.reply_text(text=data, reply_markup=ReplyKeyboardRemove())
	await update.message.reply_html(
		text=data,
		reply_markup=ReplyKeyboardRemove(),
	)

def receive_message(update):
	logger.info(update)
	logger.info('\n\n')
	logger.info(str(db))

	# Getting data from keyboard or message
	if update.callback_query:
		text = update.callback_query.data
	if update.message.web_app_data:
		text = update.message.web_app_data.data
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
			ASKHANDLE: [MessageHandler(filters.ALL, handle)],
			CONNECT: [MessageHandler(filters.ALL, connect)],
			ASK: [MessageHandler(filters.ALL, wait)],
		},
		fallbacks=[CommandHandler("cancel", cancel)],
	)

	application.add_handler(conv_handler)
	application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))

	# Run the bot until the user presses Ctrl-C
	application.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
	if '-t' in sys.argv:
		db[1636816177] = 100
	#main()
	main()
	app.run()

