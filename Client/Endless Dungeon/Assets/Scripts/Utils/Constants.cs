/*
 * Since we cannot use enum as int nor #define as constant
 * We will use a class with static members to have them all other the project
 * For exemple, the number of different spell in your bars (4 by default)
 * Number of talent points
 * Level max, etc
 */
public static class Constants
{
    public const int numberOfSpellInActionBar = 1;
}
