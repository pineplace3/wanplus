<?php
/**
 * カスタム投稿タイプ（cafe, clinic, stay）の権限を修正する
 * 
 * このファイルをテーマの functions.php に追加するか、
 * またはプラグインとして使用してください。
 */

// カスタム投稿タイプの権限を修正
add_action('init', function() {
    // cafe の権限を修正
    $cafe_post_type = get_post_type_object('cafe');
    if ($cafe_post_type) {
        $cafe_post_type->capability_type = 'post';
        $cafe_post_type->map_meta_cap = true;
        // 権限を再登録
        register_post_type('cafe', (array) $cafe_post_type);
    }
    
    // clinic の権限を修正
    $clinic_post_type = get_post_type_object('clinic');
    if ($clinic_post_type) {
        $clinic_post_type->capability_type = 'post';
        $clinic_post_type->map_meta_cap = true;
        register_post_type('clinic', (array) $clinic_post_type);
    }
    
    // stay の権限を修正
    $stay_post_type = get_post_type_object('stay');
    if ($stay_post_type) {
        $stay_post_type->capability_type = 'post';
        $stay_post_type->map_meta_cap = true;
        register_post_type('stay', (array) $stay_post_type);
    }
}, 20); // 優先度を20に設定して、Custom Post Type UIの後に実行

/**
 * REST APIでカスタム投稿タイプを作成する権限を追加
 */
add_filter('rest_pre_insert_cafe', function($prepared_post, $request) {
    // 管理者または編集者であれば許可
    if (current_user_can('edit_posts')) {
        return $prepared_post;
    }
    return new WP_Error('rest_cannot_create', '権限がありません', array('status' => 401));
}, 10, 2);

add_filter('rest_pre_insert_clinic', function($prepared_post, $request) {
    if (current_user_can('edit_posts')) {
        return $prepared_post;
    }
    return new WP_Error('rest_cannot_create', '権限がありません', array('status' => 401));
}, 10, 2);

add_filter('rest_pre_insert_stay', function($prepared_post, $request) {
    if (current_user_can('edit_posts')) {
        return $prepared_post;
    }
    return new WP_Error('rest_cannot_create', '権限がありません', array('status' => 401));
}, 10, 2);
