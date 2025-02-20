<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    // Muestra el formulario de inicio de sesión
    public function showLoginForm()
    {
        return view('auth.login'); // La vista se creará en resources/views/auth/login.blade.php
    }

    // Procesa el inicio de sesión
    public function login(Request $request)
    {
        // Validar los datos del formulario
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Intentar autenticar
        if (Auth::attempt($credentials)) {
            // Si la autenticación es exitosa, regenerar la sesión para evitar fijación de sesión
            $request->session()->regenerate();

            // Redireccionar a la ruta deseada (por ejemplo, al formulario protegido)
            return redirect()->intended('formulario');
        }

        // Si la autenticación falla, volver al formulario con un mensaje de error
        return back()->withErrors([
            'email' => 'Las credenciales proporcionadas no coinciden.',
        ]);
    }

    // Cierra la sesión del usuario
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}



