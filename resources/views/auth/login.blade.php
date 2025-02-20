<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Inicio de Sesión</title>
</head>
<body>
    <h1>Iniciar Sesión</h1>

    <form action="{{ route('login') }}" method="POST">
        @csrf
        <div>
            <label for="email">Email:</label>
            <input type="email" name="email" id="email" required autofocus>
        </div>
        <div>
            <label for="password">Contraseña:</label>
            <input type="password" name="password" id="password" required>
        </div>
        <button type="submit">Entrar</button>
    </form>

    @if ($errors->any())
        <div>
            <ul>
                @foreach ($errors->all() as $error)
                    <li style="color:red;">{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
</body>
</html>
