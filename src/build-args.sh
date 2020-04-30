source cv/main.env
diff_env(){
    diff <(bash -cl 'set -o posix && set') \
        <(set -o posix && set && set +o posix) | \
        grep -E "^>|^\+" | \
        grep -Ev "^(>|\+|\+\+) ?(BASH|COLUMNS|LINES|HIST|PPID|SHLVL|PS(1|2)|SHELL|FUNC)" | \
        sed -r 's/^> ?|^\+ ?//'
}
diff_env > cv-build.args
