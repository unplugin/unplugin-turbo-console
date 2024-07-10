import { json } from '@sveltejs/kit';
import { tConsole } from 'unplugin-turbo-console/helper'

export function GET() {
	const number = Math.floor(Math.random() * 6) + 1;
  tConsole.log({
    number
  })
	return json(number);
}
