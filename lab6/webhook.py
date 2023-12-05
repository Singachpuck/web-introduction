import os
import asyncio
import logging

from aiogram import Bot, types
from aiogram.dispatcher import Dispatcher, FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from aiogram.utils.executor import start_webhook
from aiogram.contrib.fsm_storage.memory import MemoryStorage

import requests
import json

API_TOKEN = os.environ['TG_TOKEN']

# webhook settings
WEBHOOK_HOST = 'https://dmytro.alwaysdata.net'
WEBHOOK_PATH = '/bot/'
WEBHOOK_URL = f"{WEBHOOK_HOST}{WEBHOOK_PATH}"

# webserver settings
WEBAPP_HOST = '::'  # or ip
WEBAPP_PORT = 8443

logging.basicConfig(level=logging.INFO)

loop = asyncio.get_event_loop()
bot = Bot(token=API_TOKEN, loop=loop)
storage = MemoryStorage()
dp = Dispatcher(bot, storage=storage)

WEATHER_API_ENDPOINT = 'http://api.weatherapi.com/v1'
WEATHER_API_KEY = os.environ['WEATHER_API_KEY']

class Form(StatesGroup):
    pending_city = State()
    city = State()

@dp.message_handler(commands=['start', 'help'], state='*')
async def send_welcome(message: types.Message):
    """
    This handler will be called when client send `/start` or `/help` commands.
    """
    await message.reply("Hi!\nI'm Weather Bot!\nYou can ask for current weather using /current command\nBut first set the city please: /city.")

@dp.message_handler(commands=['city'], state='*')
async def city(message: types.Message, state: FSMContext):
    await state.set_state(Form.pending_city)
    await message.reply("Send me your city")

@dp.message_handler(state=Form.pending_city)
async def setCity(message: types.Message, state: FSMContext):
    await state.set_state(Form.city)
    await state.update_data(city=message.text)
    await bot.send_message(message.chat.id, "City is set. Now call /current!")

@dp.message_handler(commands=['current'], state=Form.city)
async def current(message: types.Message, state: FSMContext):
    data = await state.get_data()
    logging.info(data)
    if 'city' not in data:
        await message.answer('City is not set! Please call /city.')
    else:
        res = requests.get(f'{WEATHER_API_ENDPOINT}/current.json?q={data["city"]}&key={WEATHER_API_KEY}')
        data = json.loads(res.text)
        content = f'{json.dumps(data["current"], indent=2)}'
        await message.answer(content)


async def on_startup(dp):
    await bot.set_webhook(WEBHOOK_URL)
    # insert code here to run it after start


async def on_shutdown(dp):
    # insert code here to run it before shutdown
    pass


if __name__ == '__main__':
    start_webhook(dispatcher=dp, webhook_path=WEBHOOK_PATH, on_startup=on_startup, on_shutdown=on_shutdown,
                  skip_updates=True, host=WEBAPP_HOST, port=WEBAPP_PORT)