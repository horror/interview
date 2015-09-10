<div class="row medium-uncollapse large-collapse">
    <div class="row">
        <div class="small-6 small-centered columns">
            <span><?=$params['msg']?></span> |
            <a href="/?controller=users&action=login">Перейти на окно логина</a>
            <form action="/?controller=users&action=registration" method="POST">
                <input  type="text" name="name" value="<?=$params['name']?>" placeholder="Имя">
                <input  type="text" name="password" value="<?=$params['password']?>" placeholder="Пароль">
                <input  type="submit" name="submit" value="sign up">
            </form>
        </div>
    </div>
</div>

