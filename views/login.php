<div class="row medium-uncollapse large-collapse">
    <div class="row">
        <div class="small-6 small-centered columns">
            <span><?=$params['msg']?></span> |
            <a href="/?controller=users&action=registration">Зарегистрироваться</a>
            <form action="/?controller=users&action=login" method="POST">
                <input  type="text" name="name" value="<?=$params['name']?>" placeholder="Имя">
                <input  type="password" name="password" value="<?=$params['password']?>" placeholder="Пароль">
                <input  type="submit" name="submit" class="button radius" value="Войти">
            </form>
        </div>
    </div>
</div>
