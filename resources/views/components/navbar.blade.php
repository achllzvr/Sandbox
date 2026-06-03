<header class="navbar app-header">
    <div class="container flex-between">
        <div class="navbar-logo logo">
            <a href="{{ route('home') }}">
                <img src="{{ asset('images/Hermy.png') }}" alt="Hermit mascot" class="navbar-logo-img" width="48" height="48">
                <span class="navbar-logo-text">SANDBOX</span>
            </a>
        </div>

        <nav class="main-nav">
            <ul>
                @if($navRole === 'guest')
                    <li>
                        <a href="{{ route('home') }}">Home</a>
                    </li>
                @endif

                @foreach($navLinks as $link)
                    <li>
                        <a href="{{ route($link['route']) }}{{ isset($link['fragment']) ? '#'.$link['fragment'] : '' }}" class="{{ $link['class'] ?? '' }}">
                            {{ $link['label'] }}
                        </a>
                    </li>
                @endforeach

                @if($navRole !== 'guest')
                    <li class="nav-user">
                        <span>{{ $navUserName }}</span>
                    </li>
                    <li>
                        <form method="POST" action="{{ route('logout') }}" class="nav-logout-form">
                            @csrf
                            <button type="submit" class="btn btn-secondary nav-btn">Logout</button>
                        </form>
                    </li>
                @endif
            </ul>
        </nav>
    </div>
</header>
