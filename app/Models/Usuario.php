<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use Notifiable;

    // Especifica que este modelo usa la tabla 'usuarios'
    protected $table = 'usuarios';

    /**
     * Los atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'nombre', 'email', 'password', 'rol'
    ];

    /**
     * Los atributos que deben ocultarse para arrays.
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
}
