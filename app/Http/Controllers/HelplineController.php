<?php

namespace App\Http\Controllers;

use App\Models\Helpline;
use Illuminate\Http\Request;

class HelplineController extends Controller
{
    public function index()
    {
        return Helpline::all();
    }
}
